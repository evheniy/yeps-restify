const {
  expect,
  request,
  createAppWithToken,
  srv,
  sslOptions,
  token,
  restify,
  Router,
  STATUS_CODES,
  config,
} = require('../../helper');

let app;
let server;

describe('YEPS restify https token test', () => {
  const { NODE_TLS_REJECT_UNAUTHORIZED } = process.env;
  const { PORT } = process.env;
  const { restApiServerUri } = config.restify;

  before(() => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    process.env.PORT = '4000';
    config.restify.restApiServerUri = 'https://localhost:3000/';
  });

  after(() => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = NODE_TLS_REJECT_UNAUTHORIZED;
    process.env.PORT = PORT;
    config.restify.restApiServerUri = restApiServerUri;
  });

  beforeEach(() => {
    app = createAppWithToken();
    server = srv.createHttpsServer(sslOptions, app);
  });

  afterEach((done) => {
    server.close(done);
  });

  it('should test not restify url', async () => {
    await request(server)
      .get('/')
      .set('X-Access-Token', token)
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
      });
  });

  it('should test empty restify', async () => {
    let isTestFinished = false;

    app.then(restify());

    await request(server)
      .get('/')
      .set('X-Access-Token', token)
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(JSON.stringify(res.body)).to.be.equal('{}');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test custom route', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    app.then(async (ctx) => {
      if (ctx.req.url === '/restify') {
        return restify()(ctx);
      }

      return app.resolve();
    });

    await request(server)
      .get('/')
      .set('X-Access-Token', token)
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
        isTestFinished1 = true;
      });

    await request(server)
      .get('/restify')
      .set('X-Access-Token', token)
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(JSON.stringify(res.body)).to.be.equal('{}');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test yeps router', async () => {
    let isTestFinished1 = false;
    let isTestFinished2 = false;

    const router = new Router();
    router.get('/restify').then(restify());

    app.then(router.resolve());

    await request(server)
      .get('/')
      .set('X-Access-Token', token)
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
        isTestFinished1 = true;
      });

    await request(server)
      .get('/restify')
      .set('X-Access-Token', token)
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(JSON.stringify(res.body)).to.be.equal('{}');
        isTestFinished2 = true;
      });

    expect(isTestFinished1).is.true;
    expect(isTestFinished2).is.true;
  });

  it('should test user restify', async () => {
    let isTestFinished = false;

    app.then(restify());

    await request(server)
      .get('/')
      .set('X-Access-Token', token)
      .query({ users: 'api/users' })
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.users).is.a('array');
        expect(res.body.data.users.length).to.be.equal(2);
        expect(res.body.data.users[0].id).to.be.equal(1);
        expect(res.body.data.users[0].name).to.be.equal('User 1');
        expect(res.body.data.users[1].id).to.be.equal(2);
        expect(res.body.data.users[1].name).to.be.equal('User 2');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test customers restify', async () => {
    let isTestFinished = false;

    app.then(restify());

    await request(server)
      .get('/')
      .set('X-Access-Token', token)
      .query({ customers: 'api/customers' })
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.customers).is.a('array');
        expect(res.body.data.customers.length).to.be.equal(2);
        expect(res.body.data.customers[0].id).to.be.equal(1);
        expect(res.body.data.customers[0].name).to.be.equal('Customer 1');
        expect(res.body.data.customers[1].id).to.be.equal(2);
        expect(res.body.data.customers[1].name).to.be.equal('Customer 2');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test customer restify', async () => {
    let isTestFinished = false;

    app.then(restify());

    await request(server)
      .get('/')
      .set('X-Access-Token', token)
      .query({ customer: 'api/customers/1' })
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.customer.id).to.be.equal(1);
        expect(res.body.data.customer.name).to.be.equal('Customer 1');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test countries restify', async () => {
    let isTestFinished = false;

    app.then(restify());

    await request(server)
      .get('/')
      .set('X-Access-Token', token)
      .query({ countries: 'api/countries' })
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.countries).is.a('array');
        expect(res.body.data.countries.length).to.be.equal(2);
        expect(res.body.data.countries[0].id).to.be.equal(1);
        expect(res.body.data.countries[0].name).to.be.equal('Country 1');
        expect(res.body.data.countries[1].id).to.be.equal(2);
        expect(res.body.data.countries[1].name).to.be.equal('Country 2');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test all restify', async () => {
    let isTestFinished = false;

    app.then(restify());

    await request(server)
      .get('/')
      .set('X-Access-Token', token)
      .query({ users: 'api/users' })
      .query({ customers: 'api/customers' })
      .query({ customer: 'api/customers/1' })
      .query({ countries: 'api/countries' })
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        // users
        expect(res.body.data.users).is.a('array');
        expect(res.body.data.users.length).to.be.equal(2);
        expect(res.body.data.users[0].id).to.be.equal(1);
        expect(res.body.data.users[0].name).to.be.equal('User 1');
        expect(res.body.data.users[1].id).to.be.equal(2);
        expect(res.body.data.users[1].name).to.be.equal('User 2');
        // customers
        expect(res.body.data.customers).is.a('array');
        expect(res.body.data.customers.length).to.be.equal(2);
        expect(res.body.data.customers[0].id).to.be.equal(1);
        expect(res.body.data.customers[0].name).to.be.equal('Customer 1');
        expect(res.body.data.customers[1].id).to.be.equal(2);
        expect(res.body.data.customers[1].name).to.be.equal('Customer 2');
        // customer
        expect(res.body.data.customer.id).to.be.equal(1);
        expect(res.body.data.customer.name).to.be.equal('Customer 1');
        // countries
        expect(res.body.data.countries).is.a('array');
        expect(res.body.data.countries.length).to.be.equal(2);
        expect(res.body.data.countries[0].id).to.be.equal(1);
        expect(res.body.data.countries[0].name).to.be.equal('Country 1');
        expect(res.body.data.countries[1].id).to.be.equal(2);
        expect(res.body.data.countries[1].name).to.be.equal('Country 2');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test wrong resource with restify', async () => {
    let isTestFinished = false;

    app.then(restify());

    await request(server)
      .get('/')
      .set('X-Access-Token', token)
      .query({ users: 'api/users' })
      .query({ customers: 'api/customers' })
      .query({ customer: 'api/customers/10' })
      .query({ countries: 'api/countries' })
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        // users
        expect(res.body.data.users).is.a('array');
        expect(res.body.data.users.length).to.be.equal(2);
        expect(res.body.data.users[0].id).to.be.equal(1);
        expect(res.body.data.users[0].name).to.be.equal('User 1');
        expect(res.body.data.users[1].id).to.be.equal(2);
        expect(res.body.data.users[1].name).to.be.equal('User 2');
        // customers
        expect(res.body.data.customers).is.a('array');
        expect(res.body.data.customers.length).to.be.equal(2);
        expect(res.body.data.customers[0].id).to.be.equal(1);
        expect(res.body.data.customers[0].name).to.be.equal('Customer 1');
        expect(res.body.data.customers[1].id).to.be.equal(2);
        expect(res.body.data.customers[1].name).to.be.equal('Customer 2');
        // customer
        expect(res.body.data.customer).is.null;
        expect(res.body.error.customer.message).to.be.equal(STATUS_CODES[404]);
        // countries
        expect(res.body.data.countries).is.a('array');
        expect(res.body.data.countries.length).to.be.equal(2);
        expect(res.body.data.countries[0].id).to.be.equal(1);
        expect(res.body.data.countries[0].name).to.be.equal('Country 1');
        expect(res.body.data.countries[1].id).to.be.equal(2);
        expect(res.body.data.countries[1].name).to.be.equal('Country 2');
        isTestFinished = true;
      });

    expect(isTestFinished).is.true;
  });

  it('should test empty token', async () => {
    app.then(restify());

    await request(server)
      .get('/')
      .send()
      .catch((err) => {
        expect(err).to.have.status(401);
      });
  });

  it('should test wrong token', async () => {
    app.then(restify());

    await request(server)
      .get('/test')
      .set('X-Access-Token', 'test')
      .send()
      .catch((err) => {
        expect(err).to.have.status(401);
      });
  });
});
