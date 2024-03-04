import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as dotenv from 'dotenv';

dotenv.config()

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) { }

  getHello(): string {
    return 'Hello World!';
  }

  public example(): void {
    this
      .mailerService
      .sendMail({
        to: 'abc@gmail.com', // List of receivers email address
        from: 'abc@gmail.com', // Senders email address
        subject: 'Testing Subscription Email', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>New subscription found</b>', // HTML body content
      })
      .then((success) => {
        console.log(success)
      })
      .catch((err) => {
        console.log(err)
      });
  }

  public sendEmail(emailInfo: any) {
    this
      .mailerService
      .sendMail({
        to: emailInfo.email, // List of receivers email address
        from: process.env.EMAIL_ID, // Senders email address
        subject: emailInfo.subject,
        template: emailInfo.template, // The `.pug` or `.hbs` extension is appended automatically.
        context: emailInfo // Data to be sent to template engine.
      })
      .then((success) => {
        console.log(success)
      })
      .catch((err) => {
        throw new HttpException(err, HttpStatus.BAD_REQUEST)
      });
  }
}
