const {
  expect,
  request,
  createAppWithToken,
  srv,
  sslOptions,
  token,
} = require('../../helper');

let app;
let server;

describe('REST API https token test', () => {
  const { NODE_TLS_REJECT_UNAUTHORIZED } = process.env;
  const { PORT } = process.env;

  before(() => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    process.env.PORT = '4000';

    app = createAppWithToken();
    server = srv.createHttpsServer(sslOptions, app);
  });

  after((done) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = NODE_TLS_REJECT_UNAUTHORIZED;
    process.env.PORT = PORT;

    server.close(done);
  });

  it('should test users resource', async () => {
    await request(server)
      .get('/api/users')
      .set('X-Access-Token', token)
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.be.equal(2);
        expect(res.body[0].id).to.be.equal(1);
        expect(res.body[0].name).to.be.equal('User 1');
        expect(res.body[1].id).to.be.equal(2);
        expect(res.body[1].name).to.be.equal('User 2');
      });
  });

  it('should test customers resource', async () => {
    await request(server)
      .get('/api/customers')
      .set('X-Access-Token', token)
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.be.equal(2);
        expect(res.body[0].id).to.be.equal(1);
        expect(res.body[0].name).to.be.equal('Customer 1');
        expect(res.body[1].id).to.be.equal(2);
        expect(res.body[1].name).to.be.equal('Customer 2');
      });
  });

  it('should test customer resource', async () => {
    await request(server)
      .get('/api/customers/1')
      .set('X-Access-Token', token)
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.id).to.be.equal(1);
        expect(res.body.name).to.be.equal('Customer 1');
      });
  });

  it('should test country resource', async () => {
    await request(server)
      .get('/api/countries')
      .set('X-Access-Token', token)
      .send()
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.length).to.be.equal(2);
        expect(res.body[0].id).to.be.equal(1);
        expect(res.body[0].name).to.be.equal('Country 1');
        expect(res.body[1].id).to.be.equal(2);
        expect(res.body[1].name).to.be.equal('Country 2');
      });
  });

  it('should test empty token', async () => {
    await request(server)
      .get('/test')
      .send()
      .catch((err) => {
        expect(err).to.have.status(401);
      });
  });

  it('should test wrong token', async () => {
    await request(server)
      .get('/test')
      .set('X-Access-Token', 'test')
      .send()
      .catch((err) => {
        expect(err).to.have.status(401);
      });
  });

  it('should test wrong resource', async () => {
    await request(server)
      .get('/test')
      .set('X-Access-Token', token)
      .send()
      .catch((err) => {
        expect(err).to.have.status(404);
      });
  });
});
