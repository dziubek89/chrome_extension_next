"use client";

import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

import React from "react";

const SignInWithGoogleButton = () => {
  const handleLogin = () => {
    supabase.auth.signInWithOAuth({ provider: "google" });

    console.log("zalogowany kod się wykonał");
  };
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => {
        handleLogin();
      }}
    >
      Login with Google
    </Button>
  );
};

export default SignInWithGoogleButton;
