import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MailService } from 'common/modules/services/mail.service';
import { Public } from 'common/decorators/public.decorator';

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
  @Get('mailcheck')
  async asmailCheck(): Promise<any> {
    return await this.mailService.sendMail(
      'virumab6@gmail.com',
      'subject new',
      null,
      true,
      'welcome',
      {
        name: 'Viruma',
        platform: 'React',
      },
    );
  }
}
