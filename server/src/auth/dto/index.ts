import { IsString, IsNotEmpty, IsEnum, IsOptional, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;

    @IsString()
    @IsNotEmpty()
    tenantId: string;

    @IsString()
    @IsOptional()
    parentId?: string;
}

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
