import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';

const server = express();
let app;

async function bootstrap() {
    if (!app) {
        app = await NestFactory.create(
            AppModule,
            new ExpressAdapter(server),
        );
        
        app.enableCors();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
        
        await app.init();
    }
    return app;
}

export default async function handler(req, res) {
    await bootstrap();
    return server(req, res);
}
