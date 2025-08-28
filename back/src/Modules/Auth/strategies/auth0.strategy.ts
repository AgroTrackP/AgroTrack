/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class Auth0JwtStrategy extends PassportStrategy(Strategy, 'auth0-jwt') {
  constructor() {
    super({
      // extrae el JWT del header Authorization: Bearer xxx
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // le dice a passport que use la JWKS de Auth0 (llaves públicas rotativas)
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
      }),
      audience: process.env.AUTH0_AUDIENCE, // 👈 debe coincidir con el Identifier de tu API
      issuer: `https://${process.env.AUTH0_DOMAIN}/`, // 👈 debe coincidir con el `iss` del token
      algorithms: ['RS256'],
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(payload: any) {
    // El payload ya viene verificado por Auth0 (firma, aud, iss)
    // Puedes mapearlo a tu modelo de usuario si quieres
    return {
      sub: payload.sub, // Auth0 user id
      email: payload.email,
      name: payload.name,
      roles: payload['../../Users/user.enum.ts'] || ['user'], // custom claim si tienes
    };
  }
}
