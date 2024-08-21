import { Module } from '@nestjs/common';

import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

import { EmailService } from './email.service';
import { EmailTemplateService } from './email-template.service.';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          // For relay SMTP server set the host to smtp-relay.gmail.com
          // and for Gmail STMO server set it to smtp.gmail.com
          host: configService.get('GMAIL_HOST'),
          // For SSL and TLS connection
          secure: true,
          port: configService.get('GMAIL_PORT'),
          logger: true,
          auth: {
            // Account gmail address
            user: configService.get('GMAIL_USER'),
            pass: configService.get('GMAIL_PASS'),
          },
        },
      }),
    }),
  ],
  controllers: [],
  providers: [EmailService, EmailTemplateService],
  exports: [EmailService],
})
export class EmailModule {}
