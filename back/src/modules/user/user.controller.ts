import { Controller, Post, Body } from "@nestjs/common";
import { refreshToken } from "firebase-admin/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { UserEmailNotificationModule } from "./user.email.service";

@Controller("user")
export class UserController {
  constructor(private emailService: UserEmailNotificationModule) {}
  @Post("/auth")
  async auth(@Body() body: { email: string; password: string }) {
    const auth = getAuth();
    const user = await signInWithEmailAndPassword(
      auth,
      body.email,
      body.password
    );
    return {
      token: await user.user.getIdToken(),
      refreshToken: user.user.refreshToken,
    };
  }

  @Post("/refresh")
  async refresh(@Body() body: { refreshToken: string }) {
    const user = await refreshToken(body.refreshToken);
    return {
      token: await user.getAccessToken(),
    };
  }

  @Post("/test")
  async test() {
    await this.emailService.sendEmail("nightw0z@gmail.com", {
      test: "test",
    });
  }
}
