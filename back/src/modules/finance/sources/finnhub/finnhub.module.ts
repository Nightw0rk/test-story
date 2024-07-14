import { Module } from "@nestjs/common";
import { FinnHubService } from "./finnhub.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Symbol, SymbolSchema } from "../../schemas/symbol.schema";
import { LastChange, LastChangeSchema } from "../../schemas/lastChange.schema";
import {
  UserSymbolWatch,
  UserSymbolWatchSchema,
} from "../../schemas/userSymbolWatch";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Symbol.name, schema: SymbolSchema },
      {
        name: LastChange.name,
        schema: LastChangeSchema,
      },
      { name: UserSymbolWatch.name, schema: UserSymbolWatchSchema },
    ]),
  ],
  providers: [FinnHubService],
  exports: [FinnHubService],
})
export class FinnHubModule {}
