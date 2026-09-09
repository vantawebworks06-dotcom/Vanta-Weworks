import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Access Restricted",
  robots: { index: false, follow: false },
};

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <Container className="max-w-md text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-gold" aria-hidden="true" />
        <h1 className="mt-6 font-display text-2xl font-semibold">Access restricted</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Your account is signed in but doesn&apos;t have admin access yet. If you believe this
          is a mistake, ask an existing administrator to grant your account admin access.
        </p>
        <Button href="/" variant="outline" size="md" className="mt-8">
          Back to homepage
        </Button>
      </Container>
    </div>
  );
}
