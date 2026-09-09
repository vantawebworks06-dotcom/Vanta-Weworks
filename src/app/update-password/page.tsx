import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata: Metadata = {
  title: "Update Password",
  robots: { index: false, follow: false },
};

export default function UpdatePasswordPage() {
  return (
    <AuthCard title="Choose a new password" description="Enter and confirm your new password below.">
      <UpdatePasswordForm />
    </AuthCard>
  );
}
