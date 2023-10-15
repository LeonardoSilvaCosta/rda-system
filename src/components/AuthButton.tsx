"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Provider } from "@supabase/supabase-js";
import githubImg from "../assets/signIn/github.svg";
import gitlabImg from "../assets/signIn/gitlab.svg";
import bitbucketImg from "../assets/signIn/bitbucket.svg";
import Image from "next/image";

type AuthButtonProps = {
  provider: Provider;
};

export default function AuthButton({ provider }: AuthButtonProps) {
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: process.env.NEXT_PUBLIC_CALLBACK_URL
      }
    });
  };

  const providerCapitalized =
    provider.charAt(0).toUpperCase() + provider.slice(1);

  const getIconAuth =
    providerCapitalized.toLowerCase() == "github"
      ? githubImg
      : providerCapitalized.toLowerCase() == "bitbucket"
        ? bitbucketImg
        : gitlabImg;

  return (
    <div>
      <div onClick={handleSignIn}>
        <Image
          src={getIconAuth}
          width={22}
          height={22}
          alt={providerCapitalized}
        />
        Sign in with {providerCapitalized}
      </div>
    </div>
  );
}

// const ContainerButtonAuth = styled("div", {
//   width: 400,

//   "@media(max-width: 400px)": {
//     maxWidth: "90%"
//   }
// });

// const ButtonAuth = styled("button", {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: "0.5rem",
//   border: "1px solid #d3d3d3",
//   background: "transparent",
//   width: "100%",
//   marginBottom: "5px",
//   borderRadius: "8px",
//   padding: "0.7rem 1rem",
//   cursor: "pointer",

//   "&:hover": {
//     background: "#eee8e8"
//   }
// });
