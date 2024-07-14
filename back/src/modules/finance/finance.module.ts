import { DynamicModule, Inject, Module } from "@nestjs/common";
import { IFinanceService } from "./finance.interface";
import { FactoryFinanceService } from "./finance.factory";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { FinnHubModule } from "./sources/finnhub/finnhub.module";
import { FinnHubService } from "./sources/finnhub/finnhub.service";
import { FinanceController } from "./finance.controller";
import * as fs from "fs";
import * as path from "path";

@Module({})
export class FinanceModule {
  public static async registerPluginsAsync(): Promise<DynamicModule> {
    const modules = FinanceModule.loadSourceModules();
    return Promise.all(modules).then((modules) => {
        const modForImport = modules.map((module) => module.module )
        const services = modules.map((module) => module.service);
        return {
            module: FinanceModule,
            imports: [ConfigModule.forRoot(), ...modForImport],
            providers: [
              {
                provide: "IFinanceService",
                useFactory: FactoryFinanceService,
                inject: [ConfigService, ...services],
              },
            ],
            controllers: [FinanceController],
          } as DynamicModule;
    }) 
  }

  private static loadSourceModules() {
    const mm = fs
      .readdirSync(path.join(__dirname, "sources"))
      .map((sourceName) => {
        return import(
          `${__dirname}/sources/${sourceName}/${sourceName}.module.js`
        )
          .then((module) => {
            return import(
              `${__dirname}/sources/${sourceName}/${sourceName}.service.js`
            ).then((service) => {
              const moduleName = Object.keys(module).find((key) =>
                key.endsWith("Module")
              );
              const serviceName = Object.keys(service).find((key) =>
                key.endsWith("Service")
              );
              return {
                module: module[moduleName],
                service: service[serviceName],
              };
            });
          })
          .then((module) => {
            return module;
          });
      });
    // const ttt = await Promise.all(mm)
    // console.log(ttt)
    return mm;
  }
}
