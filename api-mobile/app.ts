'use strict';

import express from 'express';
import * as swaggerTools from 'swagger-tools';
import * as YAML from 'yamljs';
import * as bodyParser from 'body-parser';
const swaggerConfig = YAML.load('./src/swagger/swagger.yaml');

import { getLogger } from './src/utils/logger';
const defaultLog = getLogger('app');

import { authenticate } from './src/utils/auth-utils';

const HOST = process.env.API_HOST || 'localhost';
const PORT = Number(process.env.API_PORT || '3002');

// Get initial express app
const app: express.Express = express();

// Increase post body sizing
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Enable CORS
app.use(function (req: any, res: any, next: any) {
  defaultLog.info(`${req.method} ${req.url}`);

  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization,responseType');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'max-age=4');
  next();
});

// Overwrite swagger to set the `host:port` based on current environment
swaggerConfig.host = `${HOST}:${PORT}`;

swaggerTools.initializeMiddleware(swaggerConfig, async function (middleware) {
  // add base swagger route handling middleware
  app.use(middleware.swaggerMetadata());

  //  app.use(middleware.swaggerValidator({ validateResponse: false }));

  // add swagger security for authenticated routes
  app.use(
    middleware.swaggerSecurity({
      Bearer: authenticate
    })
  );

  // add swagger route controllers
  app.use(
    middleware.swaggerRouter({
      controllers: ['./src/controllers'],
      useStubs: false
    })
  );

  // add swagger documentation route
  app.use(middleware.swaggerUi({ apiDocs: '/api/docs', swaggerUi: '/api/docs' }));

  // start api
  try {
    app.listen(PORT, '0.0.0.0', function () {
      defaultLog.info({ label: 'start api', message: `started api-mobile on ${HOST}:${PORT}/api` });
    });
  } catch (error) {
    defaultLog.error({ label: 'start api', message: 'error', error });
    process.exit(1);
  }
});
