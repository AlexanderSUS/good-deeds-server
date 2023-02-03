import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from './config/envVariables.enum';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get(EnvVariables.appPort);
  const host = configService.get(EnvVariables.appHost);

  await app.listen(port, host, () => {
    console.log(`Application is running on ${port} port`);
  });
}
bootstrap();
