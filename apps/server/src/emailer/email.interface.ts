import { Address } from 'nodemailer/lib/mailer';

export type SendEmailDto = {
  from?: Address;
  receipients: Address[];
  subject: string;
  text?: string;
  html: string;
  placeholderReplacement?: Record<string, string>;
};
