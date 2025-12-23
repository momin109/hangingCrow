import { NestFactory } from 'server/node_modules/@nestjs/core';
import { AppModule } from 'server/src/app.module';
import { ValidationPipe } from 'server/node_modules/@nestjs/common';
import serverlessExpress from '@codegenie/serverless-express';

let cachedServer;

async function bootstrap() {
    if (!cachedServer) {
        const app = await NestFactory.create(AppModule);

        app.enableCors({
            origin: process.env.FRONTEND_URL?.split(',') || '*',
            credentials: true,
        });
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
