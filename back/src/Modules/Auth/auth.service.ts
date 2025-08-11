/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../Users/entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/Helpers/hashPassword';
import { validatePassword } from 'src/Helpers/passwordValidator';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { JwtPayload } from 'src/Types/jwt-payload.interface';
import { JwksClient } from 'jwks-rsa';
import { promisify } from 'util';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AuthService {
  private jwksClient: JwksClient;

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Users) private readonly usersDbRepo: Repository<Users>,
  ) {
    // ⚠️ REEMPLAZA 'YOUR_AUTH0_DOMAIN' con el dominio de tu cuenta de Auth0 ⚠️
    this.jwksClient = new JwksClient({
      jwksUri: `https://agrotrack-project.us.auth0.com.well-known/jwks.json`,
    });
  }

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

  // En tu archivo auth.service.ts

  // ... (tus imports)

  async auth0Login(idToken: string) {
    try {
      const decodedToken = await this.validateAuth0Token(idToken);

      const auth0Id = decodedToken.sub;
      const email = decodedToken.email;
      const name = decodedToken.name;

      let user = await this.usersDbRepo.findOne({
        where: { auth0Id },
      });

      if (!user) {
        const secureRandomPassword = await hashPassword(
          'aVerySecureAndRandomPasswordThatIsNeverUsed',
        );
        user = this.usersDbRepo.create({
          auth0Id,
          email,
          name,
          password: secureRandomPassword,
        });
        await this.usersDbRepo.save(user);
      }

      const apptokenPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };
      const apptoken = this.jwtService.sign(apptokenPayload);
      const decoded = this.jwtService.decode(apptoken);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;
      const { exp, iat } = decoded;

      return {
        message: `User logged in successfully.`,
        apptoken,
        issuedAt: new Date((iat || 0) * 1000).toISOString(),
        expiresAt: new Date((exp || 0) * 1000).toISOString(),
        user: userWithoutPassword as Omit<Users, 'password'>,
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new UnauthorizedException('Invalid Auth0 token', error);
    }
  }
  private async validateAuth0Token(token: string): Promise<any> {
    try {
      const decoded = jwt.decode(token, { complete: true });
      if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new Error('Invalid token header');
      }

      // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/unbound-method
      const getSigningKey = promisify(this.jwksClient.getSigningKey);
      const key = await getSigningKey(decoded.header.kid);

      if (!key) {
        throw new Error('Signing key not found');
      }

      const signingKey = key.getPublicKey();

      // Verifica la firma, la expiración, etc., de forma segura
      return jwt.verify(token, signingKey);
    } catch (error) {
      throw new Error(`Auth0 token validation failed: ${error.message}`);
    }
  }
}
