import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from 'common/logging/logging.service';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SanitizePipe } from './common/pipes/sanitize.pipe';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const loggingService = app.get(LoggingService);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  // Global validation pipe
  app.useGlobalPipes(
    new SanitizePipe(),
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: false,
      stopAtFirstError: true,
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor(loggingService));
  // Global prefix
  app.setGlobalPrefix('api');
  // Swagger setup
  setupSwagger(app);

  // Start the application
  const port = process.env.PORT || 3000; // Use environment variable for port
  await app.listen(port, '0.0.0.0');
}

// Function to set up Swagger documentation
function setupSwagger(app: any) {
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your Bearer token',
    })
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

bootstrap();
