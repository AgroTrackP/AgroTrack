import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { Users } from '../Users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Users) private readonly usersDbRepo: Repository<Users>,
  ) {}

  // Ruta de registro de usuario
  @Post('register')
  async register(
    @Body() userData: CreateUserDto,
  ): Promise<{ message: string; user: Omit<Users, 'password'> }> {
    return await this.authService.register(userData);
  }

  //Ruta de inicio de sesión
  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const { email, password } = body;
    return await this.authService.login({ email, password });
  }

  // Ruta protegida con el token JWT
  @Get('protected')
  @UseGuards(AuthGuard('jwt'))
  protectedRoute(@Req() req: Request) {
    // req.user contendrá el user
    const user = req.user as Users;
    if (!user) {
      throw new Error('User not found in request');
    }
    return `Hola ${user.name}, esta es una ruta protegida.`;
  }

  @Get('confirmation/:email')
  async confirmationEmail(@Param('email') email: string) {
    console.log(email);
    await this.authService.confirmationEmail({ email });
    return {
      message: 'Tu cuenta ha sido verificada',
    };
  }

  @Get('auth0/login')
  @UseGuards(AuthGuard('auth0'))
  auth0Login(): void {
    return;
  }

  @Get('auth0/callback')
  @UseGuards(AuthGuard('auth0'))
  auth0Callback(@Req() req: Request, @Res() res: Response) {
    // req.user contiene el user
    const user = req.user as Users;

    // Generamos un token JWT
    const appToken = this.authService.generateAppToken(user);

    // Se redirige al frontend con el token en la URL
    res.redirect(
      `https://agrotrack-demo1-hhcln2gtq-agrotrackprojects-projects.vercel.app/dashboard?token=${appToken}`,
    );
  }
}
