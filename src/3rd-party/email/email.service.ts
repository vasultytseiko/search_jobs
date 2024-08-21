import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailOptions } from './interfaces/email.options.inteface';
import { EmailTemplateService } from './email-template.service.';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  constructor(
    private readonly mailerService: MailerService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {}

  async sendConfirmationEmail(to: string, token: string) {
    const subject = ' Email confirmation';
    const html = this.emailTemplateService.generateConfirmationHtml(token);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    return await this.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const subject = ' Reset password';
    const html = this.emailTemplateService.generatePasswordResetHtml(token);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    return await this.sendMail(mailOptions);
  }

  async sendMail(emailOptions: EmailOptions) {
    try {
      const res = await this.mailerService.sendMail(emailOptions);

      return res.accepted[0];
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
