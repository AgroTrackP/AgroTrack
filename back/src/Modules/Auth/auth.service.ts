import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { Role } from '../Users/user.enum'; // ✅ Correct import
import { ActivityService } from '../ActivityLogs/activity-logs.service';
import { ActivityType } from '../ActivityLogs/entities/activity-logs.entity';
import { ChangePasswordDto } from './dtos/ChangePassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users) private readonly usersDbRepo: Repository<Users>,
    private readonly mailService: MailService,
    private readonly activityService: ActivityService,
  ) {}

  generateAppToken(user: Users) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
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
      await this.mailService.sendRegistrationEmail(
        newUser.name || 'Usuario',
        newUser.email,
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

      await this.activityService.logActivity(
        newUser,
        ActivityType.USER_LOGIN,
        `El usuario '${newUser.name}' con email '${newUser.email}' se ha registrado.`,
      );

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
    const user = await this.usersDbRepo.findOne({
      where: { email: email },
      relations: [
        'plantations',
        'products',
        'diseases',
        'applicationPlans',
        'applicationTypes',
        'phenologies',
        'suscription_level',
        'calendarEntries',
      ],
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new ForbiddenException(
        'Your account is inactive. Please contact support.',
      );
    }

    await validatePassword(password, user.password);

    const appToken = this.generateAppToken(user);
    const { exp, iat } = this.jwtService.decode(appToken);

    await this.activityService.logActivity(
      user,
      ActivityType.USER_LOGIN,
      `El usuario '${user.name}' ha iniciado sesión.`,
    );

    return {
      message: `User logged in successfully.`,
      token: appToken,
      issuedAt: new Date((iat || 0) * 1000).toISOString(),
      expiresAt: new Date((exp || 0) * 1000).toISOString(),
      user: user,
    };
  }

  async validateUserAndGetToken(auth0User: any): Promise<{ token: string }> {
    const { email, name, picture } = auth0User;

    // 1. Buscar el usuario en tu base de datos por el email de Auth0
    let user = await this.usersDbRepo.findOne({
      where: { email },
    });
    // 2. Si el usuario no existe, crearlo
    if (!user) {
      user = this.usersDbRepo.create({
        email,
        name,
        imgUrl: picture,
        role: Role.User,
        isConfirmed: true,
      });
      await this.usersDbRepo.save(user);
    }

    // 3. Crear el payload para tu propio JWT
    const payload = {
      sub: user.id, // O el ID que uses en tu base de datos
      email: user.email,
      role: user.role,
    };

    // 4. Firmar y devolver tu propio JWT
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.usersDbRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    await validatePassword(currentPassword, user.password);

    const newHashedPassword = await hashPassword(newPassword);

    await this.usersDbRepo.update(userId, { password: newHashedPassword });

    return { message: 'Password changed successfully.' };
  }

  async sendPasswordResetEmail(email: string): Promise<{ message: string }> {
    const user = await this.usersDbRepo.findOneBy({ email });
    if (user) {
      const payload = { sub: user.id, email: user.email };
      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      });

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      await this.mailService.sendPasswordResetEmail(
        user.name,
        user.email,
        resetUrl,
      );
    }

    return {
      message:
        'If an account with that email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const newHashedPassword = await hashPassword(newPassword);

      await this.usersDbRepo.update(payload.sub, {
        password: newHashedPassword,
      });

      return { message: 'Password has been reset successfully.' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired password reset token.');
    }
  }
}
