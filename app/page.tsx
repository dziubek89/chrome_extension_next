"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@supabase/auth-helpers-react";
import { signOut } from "next-auth/react";

export default function HomePage() {
  const router = useRouter();
  const session = useSession();

  const handleRedirction = () => {
    if (!session) {
      router.push("/login");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center px-4">
      <section className="w-full max-w-3xl text-center py-20">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">
          Welcome to Our App
        </h1>
        <p className="text-lg text-gray-600 mb-12">
          Unlock powerful features to boost your productivity — simple,
          affordable, and built for you.
        </p>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-8 py-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Premium Plan
          </h2>
          <p className="text-gray-500 mb-6">
            Everything you need, just one price.
          </p>

          <div className="text-4xl font-bold text-gray-900 mb-4">
            $5
            <span className="text-base text-gray-500 font-medium">/month</span>
          </div>

          <ul className="text-left text-gray-700 space-y-3 mb-8">
            <li>✓ Access to all premium features</li>
            <li>✓ Seamless cross-device sync</li>
            <li>✓ Priority customer support</li>
            <li>✓ 100% ad-free experience</li>
          </ul>

          <button
            className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition"
            onClick={handleRedirction}
          >
            Get Premium
          </button>
        </div>

        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Sign out
        </button>
      </section>
    </main>
  );
}
