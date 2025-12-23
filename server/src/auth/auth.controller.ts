import { Body, Controller, Post, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { RegisterDto, LoginDto } from 'src/auth/dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async register(@Body() dto: RegisterDto) {
        try {
            return await this.authService.register(dto);
        } catch (error) {
            throw error;
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async login(@Body() dto: LoginDto) {
        try {
            return await this.authService.login(dto);
        } catch (error) {
            throw error;
        }
    }
}
