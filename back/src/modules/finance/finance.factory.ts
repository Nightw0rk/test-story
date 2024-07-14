import { ConfigService } from "@nestjs/config";
import { IFinanceService } from "./finance.interface";

export function FactoryFinanceService(
  configService: ConfigService,
  ...services: IFinanceService[]
): IFinanceService {
  const enabledSourceServiceName = configService.get<string>("financeSource");
  const enabledService =  services.find((service) => service.name === enabledSourceServiceName);
  if (!enabledService) {
    throw new Error(`Service ${enabledSourceServiceName} not found`);
  }
  return enabledService;
}
