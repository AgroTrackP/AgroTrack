import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/Helpers/hashPassword';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users) private readonly usersDbRepo: Repository<Users>,
  ) {}

  mockUsersDatabase = [];

  async register(
    userData: CreateUserDto,
  ): Promise<{ message: string; user: Omit<Users, 'password'> }> {
    const checkUser = await this.usersDbRepo.findOne({
      where: { email: userData.email },
    });
    if (checkUser) {
      throw new BadRequestException('User already exists with this email');
    }

    try {
      const hash = await hashPassword(userData.password);

      const newUser = this.usersDbRepo.create({
        ...userData,
        password: hash,
      });

      await this.usersDbRepo.save(newUser);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = newUser;

      return {
        message: 'User registered successfully',
        user: userWithoutPassword,
      };
    } catch (error) {
      throw new Error(`Error registering user: ${error}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(username: string, password: string): string {
    const payload = { username };
    const token = this.jwtService.sign(payload);
    return `User logged in successfully. Token: ${token}`;
  }
}
