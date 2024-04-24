import { Injectable } from '@nestjs/common';
import { MailOptions } from './smtp.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

@Injectable()
export class SmtpService {
  private host = '';
  private port = '';
  private username = '';
  private password = '';

  constructor() {
    this.host = process.env.EMAIL_HOST;
    this.port = process.env.EMAIL_PORT;
    this.username = process.env.EMAIL_USERNAME;
    this.password = process.env.EMAIL_PASSWORD;
  }

  public async sendingEmail({ from, to, html, subject }: MailOptions) {
    try {
      const transporter = nodemailer.createTransport({
        host: this.host,
        port: parseFloat(this.port),
        auth: {
          user: this.username,
          pass: this.password,
        },
      });
      transporter.sendMail(
        {
          from,
          to,
          subject,
          html,
        },
        function (error) {
          if (error) {
            throw new Error(error);
          }
        },
      );
      return {
        message: 'Succesful', // not finish
      };
    } catch (error) {
      return {
        message: `Not successful ${error}`, // not finish
      };
    }
  }
}
