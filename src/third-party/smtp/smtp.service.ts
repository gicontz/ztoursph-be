import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { MailOptions } from './smtp.dto';

@Injectable()
export class SmtpService {
  private host = '';
  private port = '';
  private username = '';
  private password = '';
  private mailOptions: MailOptions;

  constructor() {
    this.host = process.env.EMAIL_HOST;
    this.port = process.env.EMAIL_PORT;
    this.username = process.env.EMAIL_USERNAME;
    this.password = process.env.EMAIL_PASSWORD;
  }

  public async sendingEmail({ from, to, html, subject }: MailOptions) {
    try {
      const transporter = await nodemailer.createTransport({
        host: this.host,
        port: this.port,
        auth: {
          user: this.username,
          pass: this.password,
        },
      });

      // can create template.
      this.mailOptions = {
        from,
        to,
        subject,
        html,
      };

      await transporter.sendMail(this.mailOptions, (error) => {
        if (error) {
          throw new Error(error);
        }
        return {
          message: 'succesful', // not finish
        };
      });
    } catch (error) {
      return {
        message: error, // not finish
      };
    }
  }
}
