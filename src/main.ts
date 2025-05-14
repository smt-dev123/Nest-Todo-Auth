import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true, // Allow credentials (cookies, headers)
    methods: 'GET,HEAD,PUT,POST,DELETE', // Allow specific HTTP methods
    allowedHeaders: 'Content-Type, Authorization', // Allow custom headers
  });
  // Use global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors: Record<string, string[]> = {};

        errors.forEach((error) => {
          if (error.constraints) {
            formattedErrors[error.property] = Object.values(error.constraints);
          }
        });

        return new BadRequestException({
          message: formattedErrors,
          error: 'Bad Request',
          statusCode: 400,
        });
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
