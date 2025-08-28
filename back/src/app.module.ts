import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import TypeORMConfig from './Config/TypeORM.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { CloudinaryModule } from './Modules/Cloudinary/cloudinary.module';
import { AuthModule } from './Modules/Auth/auth.module';
import { UsersModule } from './Modules/Users/users.module';
import { ProductsModule } from './Modules/Products/products.module';
import { LoggerMiddleware } from './middleware/logger.midleware';
import { StripeModule } from './Modules/Stripe/stripe.module';
import { PlantationsModule } from './Modules/Plantations/plantations.module';
import { ApplicationTypesModule } from './Modules/ApplicationTypes/applicationtypes.module';
import { DiseasesModule } from './Modules/Diseases/diseases.module';
import { PhenologiesModule } from './Modules/Phenologies/phenologies.module';
import { ContactModule } from './Modules/Contacto/contacto.module';
import { SubscriptionPlanModule } from './Modules/SubscriptionPlan/subscriptionPlan.module';
import { ChatModule } from './Modules/chatbot/chatbox.module';
import { RecommendationsModule } from './Modules/Recomendations/recomendations.module';
import { ActivityLogsModule } from './Modules/ActivityLogs/activity-logs.module';
import { CalendarModule } from './Modules/Calendar/calendar.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ApplicationPlansModule } from './Modules/ApplicationPlans/applicationPlans.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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

    ChatModule,
    UsersModule,
    CloudinaryModule,
    AuthModule,
    ProductsModule,
    PlantationsModule,
    DiseasesModule,
    ApplicationTypesModule,
    PhenologiesModule,
    StripeModule,
    ContactModule,
    SubscriptionPlanModule,
    RecommendationsModule,
    ActivityLogsModule,
    CalendarModule,
    ApplicationPlansModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
