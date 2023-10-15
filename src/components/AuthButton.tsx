"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Provider } from "@supabase/supabase-js";
import Image from "next/image";
import { Button } from "./Button";

type AuthButtonProps = {
  email: string;
  password: string
};

export default function AuthButton({ email, password }: AuthButtonProps) {
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  return (
    <div>
      <Button 
        type="button"
        name="Entrar"
        onClick={handleSignIn}
      />
    </div>
  );
}

