import { NestFactory } from '@nestjs/core';
import { Response } from 'express';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use((_req, res: Response, next) => {
    res.removeHeader('X-Powered-By');
    next();
  });

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  await app.listen(8080);
}

bootstrap();
