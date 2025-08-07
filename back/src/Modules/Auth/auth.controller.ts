import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { Users } from '../Users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dtos/LoginUser.dto';

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
}
