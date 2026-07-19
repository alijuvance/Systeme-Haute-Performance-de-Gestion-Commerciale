import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });
  
  app.setGlobalPrefix('api');
  
  const config = new DocumentBuilder()
    .setTitle('ERP API')
    .setDescription('The ERP/CRM API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Activation de la validation globale des DTOs (très important pour la sécurité)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Retire les propriétés non définies dans le DTO
    forbidNonWhitelisted: true, // Rejette la requête si des props inconnues sont présentes
    transform: true, // Transforme automatiquement les payloads JSON en instances de classes DTO
  }));
  
  // Configuration des CORS — restreint au frontend uniquement
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
