"use client";
import { FcGoogle } from "react-icons/fc";
// import { LoginForm } from "@/components/login/LoginForm";

// export default function LoginPage() {
//   return (
//     <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
//       <div className="w-full max-w-sm">
//         <LoginForm />
//       </div>
//     </div>
//   );
// }

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <>
      // {/* logowanie google */}
      <div className="flex flex-wrap -mx-3 mb-6 pbt-5">
        <div className="w-full px-3">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="btn text-[#000000] bg-[#e9e9e9] hover:bg-[#e1e1e1] w-full flex items-center p-1"
          >
            <FcGoogle className="mr-5 w-[35px] h-[35px]" />
            <span className="text-[#000000] text-[12px] md:text-[16px]">
              Zaloguj się kontem Google
            </span>
          </button>
        </div>
      </div>
      <div className="orLine pt-1"></div>
      <div className="relative h-px w-full my-9 bg-gray-300 ">
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#ffffff] text-[#cccccc] px-4 text-[10px] md:text-[12px]">
          Albo
        </span>
      </div>
    </>
  );
}
