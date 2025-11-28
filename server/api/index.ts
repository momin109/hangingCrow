import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Vercel serverless handler
export default async function handler(req: any, res: any) {
    const app = await NestFactory.create(AppModule);
    
    app.enableCors();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    
    await app.init();
    
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
}
