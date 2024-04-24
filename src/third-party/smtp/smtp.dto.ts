export class TSendEmail {
  readonly value: MailOptions;
}

export type MailOptions = {
  from: string;
  to: string;
  html: string;
  subject: string;
};
