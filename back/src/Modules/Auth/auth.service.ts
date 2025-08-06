import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  register(userData: any): string {
    return `User registered successfully with data: ${JSON.stringify(userData)}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(username: string, password: string): string {
    const payload = { username };
    const token = this.jwtService.sign(payload);
    return `User logged in successfully. Token: ${token}`;
  }
}
