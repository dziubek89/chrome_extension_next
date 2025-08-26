"use client";

import { Button } from "@/components/ui/button";
// import { useSession } from "@supabase/auth-helpers-react";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();

  console.log(session, "sesja");

  const getUser = async () => {
    const res = await fetch("/api/auth/token", {
      credentials: "include",
    });

    const data = await res.json();

    // console.log(session!.access_token);
    // const token = session!.access_token;
    if (typeof window !== "undefined" && data.token) {
      console.log("window", window);

      window.postMessage(
        {
          type: "SET_TOKEN",
          token: data.token,
        },
        "*"
      );
    }
    console.log("Token wysłany:");
  };

  // const sendTokenToExtension = (token: any) => {
  //   window.postMessage({ type: "SEND_SUPABASE_TOKEN", token }, "*");
  // };

  return (
    <Button onClick={getUser} variant="outline">
      Show Toast
    </Button>
  );
}
