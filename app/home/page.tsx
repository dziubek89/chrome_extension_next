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

    console.log(data);

    // console.log(session!.access_token);
    // const token = session!.access_token;
    // if (typeof window !== "undefined") {
    //   window.postMessage(
    //     {
    //       type: "SEND_SUPABASE_TOKEN",
    //       token: session!.access_token,
    //     },
    //     "*"
    //   );
    // }
    // console.log("Token wysłany:", token);
  };

  const sendTokenToExtension = (token: any) => {
    window.postMessage({ type: "SEND_SUPABASE_TOKEN", token }, "*");
  };

  return (
    <Button onClick={getUser} variant="outline">
      Show Toast
    </Button>
  );
}
