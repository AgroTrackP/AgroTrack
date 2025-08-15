// src/auth/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Users } from 'src/Modules/Users/entities/user.entity';
import { JwtPayload } from 'src/types/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Users) private readonly userDbRepo: Repository<Users>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: JwtPayload): Promise<Users> {
    // Busca al usuario en la base de datos usando el 'sub' del payload (el ID del usuario)
    const user = await this.userDbRepo.findOne({
      where: { id: payload.sub },
    });

    // Si no se encuentra el usuario, lanza una excepción de no autorizado
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Devuelve la entidad completa del usuario. NestJS la adjuntará a `req.user`
    return user;
  }
}
