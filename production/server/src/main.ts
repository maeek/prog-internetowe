import { NestFactory } from '@nestjs/core';
import { Response } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use((_req, res: Response, next) => {
    res.removeHeader('X-Powered-By');
    next();
  });

  await app.listen(8080);
}
bootstrap();
