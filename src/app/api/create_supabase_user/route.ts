import { NextRequest } from 'next/server';

import errorMessages from '@/config/errorMessages';
import { supabase } from '@/config/supabaseAdmin';
import { generateRandomPassword } from '@/utils/generateRandomPassword';
import { sendMail } from '@/utils/sendEmail';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email)
    return Response.json('Você precisa enviar um email para ser registrado!', {
      status: 400
    });
  try {
    const randomPassword = generateRandomPassword(8);
    const { error, data } = await supabase.auth.admin.createUser({
      email: email,
      password: randomPassword,
      email_confirm: true
    });
    if (!error) {
      await sendMail(email, randomPassword).catch((error) => alert(error));

      return Response.json(data, { status: 200 });
    } else {
      const { message, status } = errorMessages.createUserFailed;
      return Response.json(`${message} ${error}`, { status });
    }
  } catch (error) {
    return Response.json(`Erro ao cadastrar usuário: ${error}`, {
      status: 400
    });
  }
}
