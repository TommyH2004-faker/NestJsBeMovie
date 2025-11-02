import { Module } from '@nestjs/common';
import { MailerService } from '../shared/mailer.service';
@Module({
  providers: [MailerService],
  exports: [MailerService], // để module khác dùng được
})
export class MailerModule {}
