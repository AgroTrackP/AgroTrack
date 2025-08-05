import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import TypeORMConfig from './Config/TypeORM.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
