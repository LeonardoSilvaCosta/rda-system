'use strict';
import nodemailer from 'nodemailer';

const emailCiap = 'ciap.pmpa@gmail.com';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    user: process.env.GMAIL_USERNAME,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_SECRET_KEY,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    accessToken: process.env.GMAIL_ACCESS_TOKEN,
    expires: 3599
  }
});

export async function sendMail(userMail: string, content: string) {
  const mailOptions = {
    from: emailCiap,
    to: userMail,
    subject: 'Seja bem-vindo(a) à nova fase do CIAP!',
    html: `
      <p>Olá,</p>
      <p>Você acabou de ser cadastro(a) no sistema do CIAP como usuário Beta!. 
      Sua contribuição será de grande valia para que o lançamento de nosso sistema seja de forma mais estável possível. 
      A previsão de lançamento é em JAN de 2024 e você está tendo a oportunidade de testar o sistema em primeira mão para identificar e relatar possíveis falhas e melhorias.</p>
      <p>Contamos com você!</p>
      <br>
      <p>Você pode se autenticar com os dados abaixo:</p>
      <p>Login: ${userMail}</p>
      <p>Senha: ${content}</p>
      <br>
      <p>Você pode acessar o sistema nesse link: https://sistema-de-prontuarios-ciap.vercel.app/login</p>
      <br>
      <p>Atenciosamente</p>
      <p>1º TEN QCOPM LEONARDO</p>
    `
  };

  await transporter.sendMail(mailOptions);
}
