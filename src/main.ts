import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentService } from './core/environment/environment.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './core/filters/all-exceptions.filter';
import cookieParser from 'cookie-parser';
import { json } from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const environmentService = app.get(EnvironmentService);
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, //delete non valid DTO props
      forbidNonWhitelisted: true, //Error if DTO comes with additional props
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  const config = new DocumentBuilder()
    .setTitle('Scheduler API')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access_token',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'refresh_token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup('apidoc', app, document);
  const port = environmentService.get<number>('PORT', 8000);
  await app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${port}`);
  });
}
void bootstrap();
