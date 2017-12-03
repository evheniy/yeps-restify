const chai = require('chai');
const chaiHttp = require('chai-http');
const App = require('yeps');
const Router = require('yeps-router');
const srv = require('yeps-server');
const error = require('yeps-error');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const { STATUS_CODES } = require('http');
const config = require('config');
const restify = require('..');

chai.use(chaiHttp);

const { expect, request } = chai;

const token = 'token';

const tokenCheck = () => (ctx) => {
  if (ctx.req.headers['x-access-token'] !== token) {
    const err = new Error();
    err.code = 401;

    return Promise.reject(err);
  }

  return Promise.resolve();
};

const createRouter = () => {
  const users = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
  ];
  const customers = [
    { id: 1, name: 'Customer 1' },
    { id: 2, name: 'Customer 2' },
  ];

  const countries = [
    { id: 1, name: 'Country 1' },
    { id: 2, name: 'Country 2' },
  ];

  const router = new Router();

  router.get('/api/users').then(async (ctx) => {
    ctx.res.end(JSON.stringify(users));
  });

  router.get('/api/customers').then(async (ctx) => {
    ctx.res.end(JSON.stringify(customers));
  });

  router.get('/api/customers/:id').then(async (ctx) => {
    const id = parseInt(ctx.request.params.id, 10);
    const response = customers.find(customer => customer.id === id);
    ctx.res.end(JSON.stringify(response));
  });

  router.get('/api/countries').then(async (ctx) => {
    ctx.res.end(JSON.stringify(countries));
  });

  return router;
};

const createApp = () => {
  const isJSON = true;
  const router = createRouter();

  const app = new App();
  app.then(error({ isJSON }));
  app.then(router.resolve());

  return app;
};

const createAppWithToken = () => {
  const isJSON = true;
  const router = createRouter();

  const app = new App();
  app.then(error({ isJSON }));
  app.then(tokenCheck());
  app.then(router.resolve());

  return app;
};

const sslOptions = {
  key: readFileSync(resolve(__dirname, 'ssl', 'key.pem')),
  cert: readFileSync(resolve(__dirname, 'ssl', 'cert.pem')),
};

module.exports = {
  expect,
  request,
  createApp,
  createAppWithToken,
  restify,
  srv,
  token,
  Router,
  sslOptions,
  STATUS_CODES,
  config,
};
