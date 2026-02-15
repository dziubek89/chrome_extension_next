"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User, Home } from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardNav() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black backdrop-blur-xl">
      <div className="mx-auto flex h-8 max-w-full items-center justify-between px-6">
        {/* LEFT – Home */}
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-300 hover:text-white hover:bg-white/10"
          onClick={() => router.push("/")}
          aria-label="Go to homepage"
        >
          <Home className="h-5 w-5" />
        </Button>

        {/* RIGHT – Profile + Logout */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-300 hover:text-white hover:bg-white/10"
            onClick={() => router.push("/profile")}
            aria-label="Go to profile"
          >
            <User className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
