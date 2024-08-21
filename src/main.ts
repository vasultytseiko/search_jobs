import { randomUUID } from 'node:crypto';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { User } from './user/models/user.model';

import RedisStore from 'connect-redis';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { SESSION_COOKIE_NAME } from './auth/constants';
import { CORS_HOSTS } from './common/constants';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  const configService = app.get(ConfigService);

  const NODE_ENV = configService.get('NODE_ENV');

  app.enableCors({
    origin: CORS_HOSTS[NODE_ENV],
    credentials: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '2',
  });

  // "useContainer" is required to allow injection of the service into validator constraints.
  // Example: src/3rd-party/postcodes.io/validators/postcode.validator.ts
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );

  const isDevelopment = NODE_ENV === 'development';

  const redisClient = createClient({
    url: configService.get('REDIS_URL'),
    socket: {
      connectTimeout: 5000,
      tls: !isDevelopment,
      ...(!isDevelopment
        ? { ca: [configService.get('REDIS_CA_CERT') as string] }
        : {}),
    },
  });

  let redisConnectionError = null;

  try {
    await redisClient.connect();
  } catch (error) {
    redisConnectionError = error;
  }

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: '',
  });

  app.use(
    session({
      store: redisStore,
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      name: SESSION_COOKIE_NAME,
      cookie: {
        secure: !isDevelopment,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      },
      genid: (req) => {
        const uniqueUid = randomUUID();

        const userId = (req.user as User)?.id || 'anonymous';
        return `sid:${userId}:${uniqueUid}`;
      },
    }),
  );

  const logger = new Logger('bootstrap');

  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('')
      .setDescription('')
      .setVersion('2.0')
      .addServer('http://localhost:8080/', 'Local environment')
      .addServer('https://staging.yourapi.com/', 'Staging')
      .addServer('https://production.yourapi.com/', 'Production')
      .addTag('')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  const PORT = configService.get('PORT') || 3000;
  await app.listen(PORT, () => {
    logger.verbose(`Server is running on port ${PORT}`);

    if (redisConnectionError) {
      logger.error(
        `Failed to connect to Redis instance: ${redisConnectionError}`,
      );
    } else {
      logger.verbose(`Connected to Redis instance.`);
    }
  });
};

bootstrap();
