"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// export const metadata = {
//   title: "Privacy Policy - Awesome Chrome Notes",
//   description: "Privacy policy for Awesome Chrome Notes Chrome extension",
// };

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0D10] text-white flex items-center justify-center px-6 py-20">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-[-200px] h-[500px] w-[500px] rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-fuchsia-600/20 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl"
      >
        <Card className="rounded-3xl border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-2xl">
          <CardContent className="p-10 space-y-8">
            {/* HEADER */}
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
                <FileText className="h-6 w-6" />
              </div>

              <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>

              <p className="text-sm text-zinc-400">
                Awesome Chrome Notes respects your privacy. Here is how your
                data is handled.
              </p>
            </div>

            {/* STORAGE & SYNC */}
            <div className="space-y-4 text-sm text-zinc-400">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-indigo-400 mt-1" />
                <div>
                  <strong>Authentication Tokens:</strong> Stored securely in
                  Chrome Storage and used to synchronize your session with{" "}
                  <a
                    href="https://chrome-extension-next.vercel.app"
                    className="text-indigo-400 underline"
                  >
                    our website
                  </a>
                  .
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-indigo-400 mt-1" />
                <div>
                  <strong>Notes Storage:</strong> Notes are{" "}
                  <strong>not stored</strong> in Chrome Storage. All note
                  content remains on the page or session and is fully controlled
                  by the user.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-indigo-400 mt-1" />
                <div>
                  <strong>Data Sharing:</strong> No personal data or browsing
                  data is shared with third parties without the user's consent.
                </div>
              </div>
            </div>

            {/* USAGE */}
            <div className="text-sm text-zinc-400">
              By using this extension, you agree to this Privacy Policy.
            </div>

            <footer className="mt-8 text-xs text-zinc-500 text-center">
              &copy; {new Date().getFullYear()} Awesome Chrome Notes
            </footer>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
