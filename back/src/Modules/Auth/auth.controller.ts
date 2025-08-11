import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { Users } from '../Users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { Request } from 'express';

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
  @Get('auth0/protected')
  auth0Protected(@Req() req: Request) {
    console.log(req.oidc.accessToken);
    return JSON.stringify(req.oidc.user);
  }
  @Post('auth0/login')
  async auth0Login(@Body() body: { token: string }) {
    // El controlador solo toma el token del body
    const { token } = body;

    // Y se lo pasa al servicio, que es quien tiene toda la lógica
    const result = await this.authService.auth0Login(token);

    // Devuelve el resultado del servicio al frontend

    return result;
  }
}
