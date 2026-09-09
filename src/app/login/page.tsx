import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Admin Sign In"
      description="Sign in to manage leads, projects, testimonials, and site content."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-foreground hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-white/5" />}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
