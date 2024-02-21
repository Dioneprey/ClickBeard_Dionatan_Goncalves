export interface SendEmailParams {
  recipientEmail: string
  message: string
  subject?: string
}

export abstract class SendEmail {
  abstract send({
    recipientEmail,
    message,
    subject,
  }: SendEmailParams): Promise<void>
}
