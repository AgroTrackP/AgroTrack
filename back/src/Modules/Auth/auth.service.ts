import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/Helpers/hashPassword';
import { validatePassword } from 'src/Helpers/passwordValidator';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { JwtPayload } from 'src/types/jwt-payload.interface';
import { MailService } from '../nodemailer/mail.service';
import { confirmationTemplate } from '../nodemailer/templates/confirmacion.html';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users) private readonly usersDbRepo: Repository<Users>,
    private readonly mailService: MailService,
  ) {}

  generateAppToken(user: Users) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async register(userData: CreateUserDto): Promise<{
    message: string;
    user: Omit<Users, 'password'>;
  }> {
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

      //enviar mail a usuario al registrarse
      await this.mailService.sendMail(
        newUser.email,
        'Bienvenido a Agrotrack',
        confirmationTemplate({
          name: newUser.name || 'Usuario',
          email: newUser.email,
        }),
      );

      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        password: _,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        imgUrl,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        imgPublicId,
        ...userWithoutSensitive
      } = newUser;

      const userWithMethods = {
        ...userWithoutSensitive,
        imgUrl: newUser.imgUrl,
        imgPublicId: newUser.imgPublicId,
        setDefaultImgUrl: newUser.setDefaultImgUrl.bind(newUser),
        setDefaultImgPublicId: newUser.setDefaultImgPublicId.bind(newUser),
      };

      return {
        message: 'User registered successfully',
        user: userWithMethods,
      };
    } catch (error) {
      throw new Error(`Error registering user: ${error}`);
    }
  }

  // confirmacion del usuario al registrarse
  async confirmationEmail({ email }: Pick<LoginUserDto, 'email'>) {
    const user = await this.usersDbRepo.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    await this.usersDbRepo.update({ email }, { isConfirmed: true });
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.usersDbRepo.findOne({ where: { email: email } });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    await validatePassword(password, user.password);

    const appToken = this.generateAppToken(user);
    const { exp, iat } = this.jwtService.decode(appToken);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return {
      message: `User logged in successfully.`,
      token: appToken,
      issuedAt: new Date((iat || 0) * 1000).toISOString(),
      expiresAt: new Date((exp || 0) * 1000).toISOString(),
      user: userWithoutPassword as Omit<Users, 'password'>,
    };
  }
}
