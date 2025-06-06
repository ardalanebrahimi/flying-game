import 'reflect-metadata';
import {
  useContainer as routingUseContainer,
  createExpressServer,
  getMetadataArgsStorage,
} from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { useContainer as ormUseContainer } from 'typeorm';
import swaggerUi from 'swagger-ui-express';
import { Container } from 'typedi';
import { LeaderboardController } from './controllers/leaderboard.controller';
import { UserController } from './controllers/user.controller';
import { initializeDatabase } from './config/database';
import { environment } from './config/environment';

// Set up dependency injection containers
routingUseContainer(Container);
ormUseContainer(Container);

async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();

    // Routing configuration
    const routingControllersOptions = {
      cors: {
        origin: environment.corsOrigin,
        credentials: true,
      },
      controllers: [LeaderboardController, UserController],
      validation: true,
      routePrefix: '/api',
      defaultErrorHandler: true,
    };

    // Create express app with routing-controllers
    const app = createExpressServer(routingControllersOptions);

    // Generate OpenAPI spec
    const storage = getMetadataArgsStorage();
    const schemas = validationMetadatasToSchemas();

    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas,
      },
      info: {
        title: 'Game API',
        version: '1.0.0',
        description: 'API for managing game leaderboard and user profiles',
      },
    });

    // Serve Swagger UI at /api-docs
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

    const port = environment.port || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`API base URL: /api`);
      console.log(`Swagger documentation: /api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
