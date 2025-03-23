import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class MailService {
  private transporter;
  private mailConfiguration;

  constructor() {
    this.mailConfiguration = {
      MAIL_HOST: 'smtp.gmail.com',
      MAIL_PORT: 587, // Gmail uses 587 for TLS
      MAIL_USER: 'moneyverse412@gmail.com', // replace with your Gmail address
      MAIL_PASS: 'lsnz spwo xvmk ducz', // replace with your Gmail App password
      MAIL_FROM: 'moneyverse412@gmail.com', // replace with your Gmail address
    };

    this.transporter = nodemailer.createTransport({
      host: this.mailConfiguration.MAIL_HOST,
      port: this.mailConfiguration.MAIL_PORT,
      secure: false, // TLS is used on port 587
      auth: {
        user: this.mailConfiguration.MAIL_USER,
        pass: this.mailConfiguration.MAIL_PASS, // your Gmail password or app password
      },
      tls: {
        rejectUnauthorized: false, // important for Gmail's security
      },
    });
  }

  private async loadTemplate(
    templateName: string,
    variables: Record<string, any>,
  ): Promise<string> {
    // Correcting the dynamic template path
    const templatePath = join(
      __dirname,
      '..',
      '..',
      'templates',
      `${templateName}.ejs`,
    );

    try {
      const template = await readFile(templatePath, 'utf-8');
      return ejs.render(template, variables);
    } catch (error) {
      console.error('Error loading template: ', error);
      throw new Error('Template not found or failed to load');
    }
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
      from: this.mailConfiguration.MAIL_FROM,
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
