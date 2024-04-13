import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class SmtpService {
  private host = '';
  private port = '';
  private username = '';
  private password = '';
  private mailOptions: {
    from: string;
    to: string;
    subject: string;
    html: string;
  };

  constructor() {
    this.host = process.env.EMAIL_HOST;
    this.port = process.env.EMAIL_PORT;
    this.username = process.env.EMAIL_USERNAME;
    this.password = process.env.EMAIL_PASSWORD;
  }

  public async sendingEmail({ sender, receiver, body, subject }) {
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
        from: sender,
        to: receiver,
        subject: subject,
        html: body,
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
