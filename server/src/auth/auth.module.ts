import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { ImpersonationService } from './impersonation.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'dev-secret-do-not-use-in-prod',
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, ImpersonationService],
    exports: [AuthService, ImpersonationService],
})
export class AuthModule { }
