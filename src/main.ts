import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from './config/envVariables.enum';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const docsConfig = new DocumentBuilder()
    .setTitle('Good-deeds')
    .setDescription('Good deeds api description')
    .addCookieAuth()
    .build();

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const document = SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get(EnvVariables.appPort);
  const host = configService.get(EnvVariables.appHost);
  const allowedOrigin = configService.get(EnvVariables.allowedOrigin);

  app.enableCors({
    origin: allowedOrigin,
    credentials: true,
  });

  await app.listen(port, host, () => {
    console.log(`Application is running on ${port} port`);
  });
}
bootstrap();
