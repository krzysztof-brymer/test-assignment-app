import { defaultMetadataStorage as classTransformerDefaultMetadataStorage } from 'class-transformer/cjs/storage';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { SchemaObject } from 'routing-controllers-openapi/node_modules/openapi3-ts/dist/model';
import { routingControllerOptions } from '../server';
import { serverConfig } from './server-config';

const schemas: SchemaObject = validationMetadatasToSchemas({
  classTransformerMetadataStorage: classTransformerDefaultMetadataStorage,
  refPointerPrefix: '#/components/schemas/'
});

export const swaggerFile = routingControllersToSpec(
  getMetadataArgsStorage(),
  routingControllerOptions,
  {
    components: {
      schemas,
      securitySchemes: {
        basicAuth: {
          type: 'http',
          scheme: 'basic'
        }
      }
    },
    security: [{ basicAuth: [] }]
  }
);

swaggerFile.servers = [
  {
    url: `http://${serverConfig.host}:${serverConfig.port}`
  }
];

swaggerFile.info = {
  title: 'test-assignment-app',
  description: 'RESTful API that handles User entities.',
  version: '1.0.0'
};
