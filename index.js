const debug = require('debug')('yeps:restify');
const promise = require('request-promise-native');
const config = require('config');
const { parse, resolve } = require('url');
const { STATUS_CODES } = require('http');

debug('Restify created');

module.exports = () => async (ctx) => {
  const response = {};

  const { query } = parse(ctx.req.url, true);
  debug('Query:');
  debug('%O', query);

  const { restApiServerUri } = config.restify;
  debug('Server uri:', restApiServerUri);

  const resources = Object.keys(query);
  debug('Resources:', resources);

  const requests = resources.map((key) => {
    debug('Key:', key);

    const uri = resolve(restApiServerUri, query[key]);
    debug('Uri:', uri);

    const { headers } = ctx.req;
    debug('Headers:');
    debug('%O', headers);

    const json = true;

    return promise({ uri, headers, json })
      .then((body) => {
        debug('Response:');
        debug('%O', body);

        if (!body) {
          const code = 404;
          const error = new Error(STATUS_CODES[code]);
          error.code = code;

          throw error;
        }

        return body;
      })
      .catch((error) => {
        debug('Error:', key);
        debug(error);
        response.error = response.error || {};
        response.error[key] = { message: error.message };
      });
  });

  return Promise.all(requests).then((data) => {
    data.forEach((item, i) => {
      response[resources[i]] = item || null;
    });

    debug('Response:');
    debug('%O', response);

    ctx.res.end(JSON.stringify(response));
  });
};
