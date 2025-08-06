import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() userData: any): string {
    console.log('User registration data:', userData);
    return this.authService.register(userData);
  }

  @Post('login')
  login(@Body() username: string, password: string): string {
    console.log('Login attempt with:', { username, password });
    return 'Este endpoint es para iniciar sesión';
  }
}
