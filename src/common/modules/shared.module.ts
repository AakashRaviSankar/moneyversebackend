import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { CryptoService } from './services/crypt.service';

@Module({
  providers: [MailService, CryptoService],
  exports: [MailService, CryptoService],
})
export class SharedModule {}
