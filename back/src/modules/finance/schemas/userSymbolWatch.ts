import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { User } from "../../user/schemas/user.schema";
import { Symbol } from "./symbol.schema";

export type UserSymbolWatchDocument = HydratedDocument<UserSymbolWatch>;

@Schema()
export class UserSymbolWatch {
  @Prop()
  uid: string;
  @Prop()
  symbol: string;
  @Prop({ type: User})
  user: any;
  @Prop()
  price: number;
  @Prop()
  direction: string;
}

export const UserSymbolWatchSchema =
  SchemaFactory.createForClass(UserSymbolWatch);
