import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // automaticamente se encarga de validar los datos que se envian en el body y solo acepta lo que forman el dto eso hace el whitelist:true
  //el forbidenonwhiteled ahora genera un problema cuando hay atributos de mas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // esto es para que nos permita transformar los datos que nos llegan en el body o queryParams, por ejemplo si nos llega un string y nosotros esperamos un numero, entonces nos lo transforma
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  // Admitimos serialiacion
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The STORE API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors();
  await app.listen(process.env.PORT || 3333);
}
bootstrap();
