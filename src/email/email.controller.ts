import { Controller,Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // @Get()
  // sendMail(): any {
  //   return this.emailService.example();
  // }
  //
  @Get()
  sendTemplate(): any {
    return this.emailService.example();
  }
 
}
