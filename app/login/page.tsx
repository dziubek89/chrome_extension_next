"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FileText, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0D10] text-white flex items-center justify-center px-6">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-[-200px] h-[500px] w-[500px] rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-fuchsia-600/20 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-3xl border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-2xl">
          <CardContent className="p-10 space-y-8">
            {/* HEADER */}
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
                <FileText className="h-6 w-6" />
              </div>

              <h1 className="text-3xl font-bold text-white">
                Log in to <span className="text-indigo-400">Docs</span>
              </h1>

              <p className="text-sm text-zinc-400">
                Your notes are safe, synchronized, and accessible on every
                computer.
              </p>
            </div>

            {/* GOOGLE LOGIN */}
            <Button
              size="lg"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full bg-white text-black hover:bg-zinc-100 flex items-center justify-center gap-3"
            >
              <FcGoogle className="h-5 w-5" />
              Log in with Google account
            </Button>

            {/* DIVIDER */}
            <div className="relative">
              <div className="h-px w-full bg-white/10 " />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  px-4 text-xs text-zinc-500 bg-[#212325] rounded">
                Safe Login
              </span>
            </div>

            {/* TRUST INFO */}
            <div className="space-y-3 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                Login via Google (OAuth)
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                Notes stored securely in the cloud
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                Access your data on any device
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}

// "use client";
// import { FcGoogle } from "react-icons/fc";
// // import { LoginForm } from "@/components/login/LoginForm";

// // export default function LoginPage() {
// //   return (
// //     <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
// //       <div className="w-full max-w-sm">
// //         <LoginForm />
// //       </div>
// //     </div>
// //   );
// // }

// import { signIn } from "next-auth/react";

// export default function LoginPage() {
//   return (
//     <>
//       <div className="flex flex-wrap -mx-3 mb-6 pbt-5">
//         <div className="w-full px-3">
//           <button
//             onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
//             className="btn text-[#000000] bg-[#e9e9e9] hover:bg-[#e1e1e1] w-full flex items-center p-1"
//           >
//             <FcGoogle className="mr-5 w-[35px] h-[35px]" />
//             <span className="text-[#000000] text-[12px] md:text-[16px]">
//               Zaloguj się kontem Google
//             </span>
//           </button>
//         </div>
//       </div>
//       <div className="orLine pt-1"></div>
//       <div className="relative h-px w-full my-9 bg-gray-300 ">
//         <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#ffffff] text-[#cccccc] px-4 text-[10px] md:text-[12px]">
//           Albo
//         </span>
//       </div>
//     </>
//   );
// }
