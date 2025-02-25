import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { getDataFromJsonFile } from 'common/utils/fileUtils';
import * as ejs from 'ejs';
import { readFile } from 'fs/promises';
import { join } from 'path';

const configuration = getDataFromJsonFile('src/config/config.json');
export class MailService {
  private transporter;
  private mailcongigration;

  constructor() {
    this.mailcongigration = configuration.mail;
    this.transporter = nodemailer.createTransport({
      host: this.mailcongigration.MAIL_HOST,
      port: this.mailcongigration.MAIL_PORT,
      secure: !!this.mailcongigration.IS_SECURE, // true for 465, false for other ports
      auth: {
        user: this.mailcongigration.MAIL_USER,
        pass: this.mailcongigration.MAIL_PASS,
      },
    });
  }
  private async loadTemplate(
    templateName: string,
    variables: Record<string, any>,
  ): Promise<string> {
    const templatePath = join(
      __dirname,
      '..',
      '..',
      'templates',
      `${templateName}.ejs`,
    );
    const template = await readFile(
      'src/common/templates/welcome.ejs',
      'utf-8',
    );
    return ejs.render(template, variables);
  }
  async sendMail(
    to: string,
    subject: string,
    text: string,
    isTemplate: boolean = false,
    templateName?: string,
    variables?: Record<string, any>,
    cc?: string[],
    bcc?: string[],
  ): Promise<any> {
    let html = '';

    // Check if isTemplate is true and templateName is provided
    if (isTemplate && templateName && variables) {
      html = await this.loadTemplate(templateName, variables);
    }

    const mailOptions = {
      from: this.mailcongigration.MAIL_FROM,
      to,
      subject,
      text,
      html,
      cc,
      bcc,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email: ', error);
      throw error;
    }
  }
}
