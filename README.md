# YEPS Restify

REST API request aggregate

[![NPM](https://nodei.co/npm/yeps-restify.png)](https://npmjs.org/package/yeps-restify)

[![npm version](https://badge.fury.io/js/yeps-restify.svg)](https://badge.fury.io/js/yeps-restify)
[![Build Status](https://travis-ci.org/evheniy/yeps-restify.svg?branch=master)](https://travis-ci.org/evheniy/yeps-restify)
[![Coverage Status](https://coveralls.io/repos/github/evheniy/yeps-restify/badge.svg?branch=master)](https://coveralls.io/github/evheniy/yeps-restify?branch=master)
[![Linux Build](https://img.shields.io/travis/evheniy/yeps-restify/master.svg?label=linux)](https://travis-ci.org/evheniy/)
[![Windows Build](https://img.shields.io/appveyor/ci/evheniy/yeps-restify/master.svg?label=windows)](https://ci.appveyor.com/project/evheniy/yeps-restify)

[![Dependency Status](https://david-dm.org/evheniy/yeps-restify.svg)](https://david-dm.org/evheniy/yeps-restify)
[![devDependency Status](https://david-dm.org/evheniy/yeps-restify/dev-status.svg)](https://david-dm.org/evheniy/yeps-restify#info=devDependencies)
[![NSP Status](https://img.shields.io/badge/NSP%20status-no%20vulnerabilities-green.svg)](https://travis-ci.org/evheniy/yeps-restify)

[![Known Vulnerabilities](https://snyk.io/test/github/evheniy/yeps-restify/badge.svg)](https://snyk.io/test/github/evheniy/yeps-restify)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/evheniy/yeps-restify/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/evheniy/yeps-restify.svg)](https://github.com/evheniy/yeps-restify/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/evheniy/yeps-restify.svg)](https://github.com/evheniy/yeps-restify/network)
[![GitHub issues](https://img.shields.io/github/issues/evheniy/yeps-restify.svg)](https://github.com/evheniy/yeps-restify/issues)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/evheniy/yeps-restify.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)

  
## How to install

    npm i -S yeps-restify

## How to use

### Config

#### config/default.json

    {
      "restify": {
        "restApiServerUri": "http://localhost/"
      }
    }
    
#### app.js

    const App = require('yeps');
    
    const error = require('yeps-error');
    const logger = require('yeps-logger');
    const server = require('yeps-server');
    
    const restify = require('yeps-restify');
    
    const app = new App();
    
    app.all([
      error({ isJSON: true }),
      logger(),
    ]);
    
    app.then(restify());
    
    server.createHttpServer(app);
    
## Custom router
    
    app.then(async (ctx) => {
      if (ctx.req.url === '/restify') {
        return restify()(ctx);
      }
      
      return app.resolve();
    });
    
## With router

    const Router = require('yeps-router');
    
    const router = new Router();
    
    router.get('/restify').then(restify());
    
    app.then(router.resolve());

## Example

### app

    const App = require('yeps');
    const Router = require('yeps-router');
    
    const error = require('yeps-error');
    const logger = require('yeps-logger');
    const server = require('yeps-server');
    
    const restify = require('yeps-restify');
    
    const app = new App();
    const router = new Router();
    
    app.all([
      error({ isJSON: true }),
      logger(),
    ]);
    
    router.get('/restify').then(restify());
        
    app.then(router.resolve());
    
    // REST API

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
  
    const restRouter = new Router();
  
    restRouter.get('/api/users').then(async (ctx) => {
      ctx.res.end(JSON.stringify(users));
    });
  
    restRouter.get('/api/customers').then(async (ctx) => {
      ctx.res.end(JSON.stringify(customers));
    });
  
    restRouter.get('/api/customers/:id').then(async (ctx) => {
      const id = parseInt(ctx.request.params.id, 10);
      const response = customers.find(customer => customer.id === id);
      ctx.res.end(JSON.stringify(response));
    });
  
    restRouter.get('/api/countries').then(async (ctx) => {
      ctx.res.end(JSON.stringify(countries));
    });
    
    app.then(restRouter.resolve());
    
    server.createHttpServer(app);

### Request

    /restify?users=api/users&customer=api/customer/1&countries=api/countries
    
### Response

    {
      "users": [
        { "id": 1, "name": "User 1" },
        { "id": 2, "name": "User 2" }
      ],
      "customer": {
        "id": 1,
        "name": "Customer 1"
      },
      "countries": [
        { "name": "Country 1" },
        { "name": "Country 2" }
      ]
    }

#### [YEPS documentation](http://yeps.info/)
