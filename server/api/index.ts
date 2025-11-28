import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import serverlessExpress from '@codegenie/serverless-express';

let cachedServer;

async function bootstrap() {
    if (!cachedServer) {
        const app = await NestFactory.create(AppModule);

        app.enableCors();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

        await app.init();

        const expressApp = app.getHttpAdapter().getInstance();
        cachedServer = serverlessExpress({ app: expressApp });
    }
    return cachedServer;
}

export default async function handler(req, res) {
    const server = await bootstrap();
    return server(req, res);
}
