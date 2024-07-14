import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { IFinanceSymbol } from "../finance.interface";

export type SymbolDocument = HydratedDocument<Symbol>;

@Schema()
export class Symbol implements IFinanceSymbol {
  @Prop()
  currency: string;
  @Prop()
  description: string;
  @Prop()
  displaySymbol: string;
  @Prop()
  figi: string;
  @Prop()
  isin: string | null;
  @Prop()
  mic: string;
  @Prop()
  shareClassFIGI: string;
  @Prop()
  symbol: string;
  @Prop()
  symbol2: string;
  @Prop()
  type: string;
}

export const SymbolSchema = SchemaFactory.createForClass(Symbol);
