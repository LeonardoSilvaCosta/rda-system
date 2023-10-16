'use client';

import { Button } from './Button';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type AuthButtonProps = {
  email: string;
  password: string;
};

export default function AuthButton({ email, password }: AuthButtonProps) {
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email,
      password
    });
  };

  return (
    <div>
      <Button type="button" name="Entrar" onClick={handleSignIn} />
    </div>
  );
}
