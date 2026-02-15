"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  Chrome,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// MOCK – podmień na Supabase / backend
const useAuth = () => ({
  user: null,
  isPremium: false,
  loading: false,
});

export default function HomePage() {
  const router = useRouter();
  const { user, isPremium, loading } = useAuth();

  // useEffect(() => {
  //   if (loading) return;
  //   if (!user) return;
  //   if (user && !isPremium) router.push("/pricing");
  //   if (user && isPremium) router.push("/dashboard");
  // }, [user, isPremium, loading, router]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0B0D10] text-white">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-[-200px] h-[500px] w-[500px] rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-fuchsia-600/20 blur-[120px]" />
      </div>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
        >
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-zinc-300">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Modern documentation
            </span>

            <h1 className="text-6xl font-bold leading-tight">
              Documentation,
              <br />
              that <span className="text-indigo-400">lives</span>
            </h1>

            <p className="max-w-xl text-lg text-zinc-400">
              Create notes and technical documentation linked to specific pages,
              projects, and contexts. Always where you work, and share them with
              your colleagues.
            </p>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="bg-indigo-400 hover:bg-indigo-700"
                onClick={() => router.push("/login")}
              >
                Start now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {/* <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/pricing")}
              >
                Premium
              </Button> */}
            </div>
          </div>

          {/* MOCK APP PREVIEW */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            <Card className="rounded-3xl border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-2xl">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3 text-indigo-400">
                  <FileText className="h-6 w-6" />
                  <span className="font-semibold">Project Docs</span>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-3/4 rounded bg-white/20" />
                  <div className="h-3 w-full rounded bg-white/10" />
                  <div className="h-3 w-5/6 rounded bg-white/10" />
                </div>
                <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-300">
                  // Note attached to the current page
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-white/10 py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FancyFeature
            icon={Chrome}
            title="Chrome Extension"
            description="Document without leaving the page you are currently working on."
          />
          <FancyFeature
            icon={ShieldCheck}
            title="Safe Cloud"
            description="Your notes are synchronized and always available."
          />
          <FancyFeature
            icon={Sparkles}
            title="Premium Workflow"
            description="Advanced organization, projects, and unlimited notes."
          />
        </div>
      </section>

      {/* PRICING */}
      <section className="border-t border-white/10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold">
              Simple <span className="text-indigo-400">pricing</span>
            </h2>
            <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
              Your notes are securely stored in the cloud. Even if your computer
              breaks down, you can access them from any device.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-white">
            {/* FREE */}
            <PricingCard
              title="Free"
              price="0 usd"
              description="Perfect for start"
              features={[
                "Notes linked to pages",
                "Quick adding and editing",
                "Synchronization across computers",
                "Secure cloud storage",
              ]}
              button="Start for free"
              onClick={() => router.push("/login")}
            />

            {/* PREMIUM */}
            <PricingCard
              highlighted
              title="Premium"
              price="19 usd / month."
              description="For developers"
              features={[
                "Unlimited notes",
                "Projects and advanced organization",
                "Access your notes on any computer",
                "Priority support",
              ]}
              button="Become Premium"
              onClick={() => router.push("/pricing")}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function FancyFeature({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <Card className="group rounded-3xl border-white/10 bg-white/5 transition hover:bg-white/10">
      <CardContent className="p-8 space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-zinc-400 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

function PricingCard({
  title,
  price,
  description,
  features,
  button,
  highlighted = false,
  onClick,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  button: string;
  highlighted?: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      className={`relative rounded-3xl border bg-white/5 p-8 ${
        highlighted
          ? "border-indigo-500/50 shadow-[0_0_60px_-15px_rgba(99,102,241,0.6)]"
          : "border-white/10"
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 right-6 rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold">
          Most popular
        </span>
      )}

      <CardContent className="p-0 space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-white">{title}</h3>
          <p className="text-zinc-400 text-sm">{description}</p>
        </div>

        <div className="text-4xl font-bold text-white">{price}</div>

        <ul className="space-y-3 text-sm text-zinc-300">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
              {f}
            </li>
          ))}
        </ul>

        <Button
          size="lg"
          className={`w-full ${
            highlighted
              ? "bg-indigo-600 hover:bg-indigo-500"
              : "bg-white/10 hover:bg-white/20"
          }`}
          onClick={onClick}
        >
          {button}
        </Button>
      </CardContent>
    </Card>
  );
}

//STARY KOMPONENT

// "use client";

// import { useRouter } from "next/navigation";
// import { useSession } from "@supabase/auth-helpers-react";
// import { signOut } from "next-auth/react";

// export default function HomePage() {
//   const router = useRouter();
//   const session = useSession();

//   const handleRedirction = () => {
//     if (!session) {
//       router.push("/login");
//     } else {
//       router.push("/dashboard");
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center px-4">
//       <section className="w-full max-w-3xl text-center py-20">
//         <h1 className="text-5xl font-bold mb-4 text-gray-800">
//           Welcome to Our App
//         </h1>
//         <p className="text-lg text-gray-600 mb-12">
//           Unlock powerful features to boost your productivity — simple,
//           affordable, and built for you.
//         </p>

//         <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-10">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-1">
//             Premium Plan
//           </h2>
//           <p className="text-gray-500 mb-6">
//             Everything you need, just one price.
//           </p>

//           <div className="text-4xl font-bold text-gray-900 mb-4">
//             $5
//             <span className="text-base text-gray-500 font-medium">/month</span>
//           </div>

//           <ul className="text-left text-gray-700 space-y-3 mb-8">
//             <li>✓ Access to all premium features</li>
//             <li>✓ Seamless cross-device sync</li>
//             <li>✓ Priority customer support</li>
//             <li>✓ 100% ad-free experience</li>
//           </ul>

//           <button
//             className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition"
//             onClick={handleRedirction}
//           >
//             Get Premium
//           </button>
//         </div>

//         <button
//           onClick={() => signOut()}
//           className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//         >
//           Sign out
//         </button>
//       </section>
//     </main>
//   );
// }
