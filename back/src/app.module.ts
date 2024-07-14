import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { FinanceModule } from "./modules/finance/finance.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./config/configuration";
import { MongooseModule } from "@nestjs/mongoose";
import { PreauthMiddleware } from "./modules/user/auth.middleware";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get("mongoConnection"),
      }),
    }),
    // Import the FinanceModule
    FinanceModule.registerPluginsAsync(),
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PreauthMiddleware)
      .exclude({
        path: "/user/auth",
        method: RequestMethod.ALL,
      })
      .exclude({
        path: "*",
        method: RequestMethod.OPTIONS | RequestMethod.GET,
      })
      .forRoutes({
        path: "*",
        method:
          RequestMethod.DELETE |
          RequestMethod.PATCH |
          RequestMethod.POST |
          RequestMethod.PUT |
          RequestMethod.GET,
      });
  }
}
