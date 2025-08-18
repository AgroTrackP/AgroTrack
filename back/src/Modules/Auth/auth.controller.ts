import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
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
import { hashPassword } from 'src/Helpers/hashPassword';

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
  // Esta ruta inicia el flujo de autenticación, redirigiendo a Auth0.
  // La guardia 'auth0' maneja la redirección.
  @Post('auth0/login')
  @UseGuards(AuthGuard('auth0-jwt'))
  async handleAuth0Login(
    @Req() req,
    // Aquí recibimos los datos que enviaste desde el frontend
    @Body()
    body: {
      name: string;
      email: string;
      picture: string;
    },
  ) {
    // El ID de Auth0 siempre viene en el payload del token como 'sub'
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const auth0Id = req.user.sub;

    // Aquí usamos los datos del 'body' para el nombre y el correo
    const email = body.email;
    const name = body.name;

    let user = await this.usersDbRepo.findOne({
      where: { auth0Id },
    });

    if (!user) {
      // Genera una contraseña aleatoria de relleno
      const secureRandomPassword = await hashPassword('password-never-used');

      user = this.usersDbRepo.create({
        auth0Id: auth0Id,
        email: email, // Usamos el email del body
        name: name, // Usamos el nombre del body
        password: secureRandomPassword,
        imgUrl: body.picture,
      });
      user = await this.usersDbRepo.save(user);
    }

    const yourApiToken = this.authService.generateAppToken(user);

    return { user, token: yourApiToken };
  }
}
