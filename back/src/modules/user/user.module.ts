import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UserController } from "./user.controller";
import { initializeApp } from "firebase/app";
import { UserEmailNotificationModule } from "./user.email.service";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserEmailNotificationModule],
  exports: [UserEmailNotificationModule],
})
export class UserModule {
  constructor() {
    initializeApp({
      apiKey: "AIzaSyCKXdOs1vb2Ktld_hum8-Nj5BZ5q0uBGbY",
      authDomain: "nest-next-test.firebaseapp.com",
      projectId: "nest-next-test",
      storageBucket: "nest-next-test.appspot.com",
      messagingSenderId: "195170438312",
      appId: "1:195170438312:web:fbb8f3d82a1d12ff83c69d",
    });
  }
}
