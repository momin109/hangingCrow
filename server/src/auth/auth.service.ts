import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto'; // Assuming DTOs will be created
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const hash = await bcrypt.hash(dto.password, 10);
        try {
            const user = await this.prisma.user.create({
                data: {
                    username: dto.username,
                    password: hash,
                    role: dto.role || Role.USER,
                    tenant: {
                        connect: { id: dto.tenantId },
                    },
                    // Create a wallet for the user
                    wallet: {
                        create: {
                            currency: 'BDT',
                        },
                    },
                },
            });
            return this.signToken(user.id, user.username, user.role, user.tenantId);
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Username already exists');
            }
            throw error;
        }
    }

    async login(dto: LoginDto) {
        try {
            if (!dto.username || !dto.password) {
                throw new UnauthorizedException('Username and password are required');
            }

            const user = await this.prisma.user.findUnique({
                where: { username: dto.username.trim() },
            });

            if (!user) {
                throw new UnauthorizedException('Invalid username or password');
            }

            const pwMatches = await bcrypt.compare(dto.password, user.password);
            if (!pwMatches) {
                throw new UnauthorizedException('Invalid username or password');
            }

            return this.signToken(user.id, user.username, user.role, user.tenantId);
        } catch (error) {
            // Re-throw known exceptions
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            // Handle unexpected errors
            console.error('Login error:', error);
            throw new UnauthorizedException('Authentication failed. Please try again.');
        }
    }

    async signToken(userId: string, username: string, role: Role, tenantId: string) {
        const payload = {
            sub: userId,
            username,
            role,
            tenantId,
        };
        const secret = process.env.JWT_SECRET;

        const token = await this.jwtService.signAsync(payload, {
            expiresIn: '24h',
            secret: secret,
        });

        return {
            access_token: token,
            token, // Add this for backward compatibility
            user: {
                id: userId,
                username,
                role,
                tenantId,
            },
        };
    }
}
