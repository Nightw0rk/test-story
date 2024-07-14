import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class UserEmailNotificationModule {
  private configService: ConfigService;
  constructor(@Inject(ConfigService) configService: ConfigService) {
    this.configService = configService;
  }

  async sendEmail(email: string, params?: any) {
    const body = {
        to: [{ email: email }],
        templateId: parseInt(this.configService.get<string>("brevoTemplateId")),
        params: params || {}
    }
    await fetch("https://api.sendinblue.com/v3/smtp/email",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": this.configService.get<string>("brevoApiKey"),
            "Accept": "application/json"
        },
        body: JSON.stringify(body)
    } )
    // const emailSender = new brevo.SendSmtpEmail();
    // this.apiInstance.getSmtpTemplates().then((res) => {
    //   console.log(res.body);
    // });
    // // emailSender.sender = {
    // //     email: this.configService.get<string>("brevoSenderEmail"),
    // //     name: this.configService.get<string>("brevoSenderName")
    // // }
    // emailSender.to = [{ email: email }];
    // emailSender.templateId = this.configService.get<number>("brevoTemplateId");
    // console.log(this.configService.get<number>("brevoTemplateId"));
    // // emailSender.params = params
    // // return await this.apiInstance.sendTransacEmail(emailSender)
  }
}
