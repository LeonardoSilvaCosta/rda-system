"use client";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import AuthButton from "@/components/AuthButton";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { createClientComponentClient, Session } from "@supabase/auth-helpers-nextjs";

type EmailType = {
  email: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const schema = yup
  .object({
    email: yup.string().email().required()
  })
  .required();

const Login = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<EmailType>({
    resolver: yupResolver(schema)
  });
  const router = useRouter();

  // const [toast, setToaste] = useState<TypeToast>({
  //   enable: false,
  //   title: "",
  //   description: "",
  //   buttonVariant: "secondary"
  // });
  const [user, setUser] = useState<Session>();
  const [magicLink, setMagicLink] = useState<boolean>(false);
  const supabase = createClientComponentClient();

  user && router.push("/projects");

  async function handleSignIn({ email }: EmailType) {
    // try {
    //   const { error } = await supabase.auth.signInWithOtp({
    //     email,
    //     options: {
    //       emailRedirectTo: process.env.NEXT_PUBLIC_CALLBACK_URL
    //     }
    //   });

    //   if (error) {
    //     setToaste({
    //       enable: true,
    //       title: "Exceeded attempt limit",
    //       description: "Try again later",
    //       buttonVariant: "red"
    //     });
    //   } else {
    //     setToaste({
    //       enable: true,
    //       title: "Magic link sent",
    //       description: "Verify your e-mail!",
    //       buttonVariant: "secondary"
    //     });
    //   }

    //   setTimeout(() => {
    //     setToaste({ enable: false });
    //   }, 3000);

    //   reset();
    // } catch (error) {
    //   // throw new error();
    // }
  }

  return (
    <h1>
    Sign In Page
    </h1>
  );
};

export default Login;
