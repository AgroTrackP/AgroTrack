// src/auth/strategies/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Users } from 'src/Modules/Users/entities/user.entity';
import { JwtPayload } from 'src/types/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Users) private readonly userDbRepo: Repository<Users>,
    private readonly configService: ConfigService,
  ) {
    const secret = configService.getOrThrow<string>('JWT_SECRET'); // <-- Obtenemos el secreto una vez
    console.log('CLAVE SECRETA PASADA A SUPER():', secret); // <-- Log definitivo
    console.log('--- JwtStrategy ---');
    console.log('SECRET USADO PARA VERIFICAR:', process.env.JWT_SECRET);
    console.log('-------------------');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
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

    console.log('--- PRUEBA DE VALIDACIÓN ---');
    console.log('El método validate SÍ se está ejecutando.');
    console.log('Payload recibido:', payload);
    console.log('--------------------------');

    // Devuelve la entidad completa del usuario. NestJS la adjuntará a `req.user`
    return user;
  }
}
