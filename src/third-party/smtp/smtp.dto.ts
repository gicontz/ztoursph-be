export class TSendEmail {
  readonly value: MailOptions;
}

export type TAttachment = {
  filename: string;
  content: Buffer | string;
};

export type MailOptions = {
  from: string;
  to: string[];
  html: string | { path: string };
  subject: string;
  attachments?: TAttachment[];
};
