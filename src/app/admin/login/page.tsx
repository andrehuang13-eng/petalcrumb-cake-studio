import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/dal";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Studio Sign-in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // Already signed in → straight to the dashboard.
  if (await getSession()) redirect("/admin");

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-rose mb-4">
            Petalcrumb · Studio
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-[0.95] tracking-[-0.02em]">
            Sign in
          </h1>
          <p className="text-ink-soft text-sm mt-3">
            Studio admin access only.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
