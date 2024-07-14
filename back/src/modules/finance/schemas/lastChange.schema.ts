import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type LastChangeDocument = HydratedDocument<LastChange>;

@Schema()
export class LastChange {
  @Prop()
  collectionName: string;
  @Prop()
  stamp: Date;

}

export const LastChangeSchema = SchemaFactory.createForClass(LastChange);
