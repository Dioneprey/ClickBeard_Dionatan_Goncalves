import { SendEmail, SendEmailParams } from "src/domain/barbershop/application/mail/send-email";

export class FakeMail implements SendEmail {
    async send({ recipientEmail, message, subject }: SendEmailParams){
        console.log('Fake email enviado');        
    }
}