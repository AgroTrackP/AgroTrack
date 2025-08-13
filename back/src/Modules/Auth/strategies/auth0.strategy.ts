/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, Profile } from 'passport-auth0';
import { Repository } from 'typeorm';
import { Users } from 'src/Modules/Users/entities/user.entity';
import { hashPassword } from 'src/Helpers/hashPassword';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(
    @InjectRepository(Users) private readonly userDbRepo: Repository<Users>,
  ) {
    const auth0StrategyOptions = {
      domain: process.env.AUTH0_DOMAIN!,
      clientID: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      callbackURL: process.env.AUTH0_CALLBACK_URL!,
      scope: 'openid profile email',
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(auth0StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    extraParams: any,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    try {
      const auth0Id = profile.id;
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName;

      if (!email || !auth0Id) {
        return done(new Error('Email or Auth0 ID not found'), false);
      }

      let user = await this.userDbRepo.findOne({
        where: { auth0Id },
      });

      if (!user) {
        const secureRandomPassword = await hashPassword(
          'A-secure-for-auth0-users-that-is-never-used',
        );
        user = this.userDbRepo.create({
          auth0Id,
          email,
          name,
          password: secureRandomPassword,
        });
        await this.userDbRepo.save(user);
      }

      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
