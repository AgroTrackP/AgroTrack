import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/Helpers/hashPassword';
import { validatePassword } from 'src/Helpers/passwordValidator';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { JwtPayload } from 'src/Types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users) private readonly usersDbRepo: Repository<Users>,
  ) {}

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
  async login({ email, password }: LoginUserDto) {
    const user = await this.usersDbRepo.findOne({ where: { email: email } });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    await validatePassword(password, user.password);

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const decoded = this.jwtService.decode(token) as JwtPayload;
    const { exp, iat } = decoded;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return {
      message: `User logged in successfully.`,
      token,
      issuedAt: new Date((iat || 0) * 1000).toISOString(),
      expiresAt: new Date((exp || 0) * 1000).toISOString(),
      user: userWithoutPassword as Omit<Users, 'password'>,
    };
  }
}
