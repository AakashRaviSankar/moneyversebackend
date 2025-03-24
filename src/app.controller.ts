import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MailService } from 'common/modules/services/mail.service';
import { Public } from 'common/decorators/public.decorator';
import { ComplaintDto } from 'complaint.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailService: MailService,
  ) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }
  @Public()
  @Post('complaint')
  async asmailCheck(@Body() body: ComplaintDto): Promise<any> {
    return await this.mailService.sendMail(
      body.email,
      'Thank You for Contacting Us',
      null,
      false,
      body.complaint,
    );
  }

  @Public()
  @Get('deviceversion')
  async deviceVersion(): Promise<any> {
    return { version: '1.0.0' };
  }
}
