import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import TypeORMConfig from './Config/TypeORM.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { AuthModule } from './Modules/Auth/auth.module';
import { jwtConfig } from './Config/JWT.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [TypeORMConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.get<DataSourceOptions>('typeorm');
        return {
          ...config,
          autoLoadEntities: true,
        };
      },
    }),
    AuthModule,
    JwtModule.register(jwtConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
