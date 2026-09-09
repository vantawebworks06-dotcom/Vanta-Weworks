import { LogIn, ShieldCheck, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export async function ClientSignIn() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    isAdmin = profile?.role === "admin";
  }

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <Reveal className="relative overflow-hidden rounded-3xl border border-border bg-surface/60 p-10 text-center sm:p-14">
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
            style={{ background: "var(--gradient-brand)" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto flex max-w-xl flex-col items-center">
            <Badge>
              <LogIn className="h-3.5 w-3.5 text-accent-2" aria-hidden="true" />
              Client Portal
            </Badge>

            {user ? (
              <>
                <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Welcome back
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  Pick up where you left off — view your inquiries, project submissions, and
                  saved AI Visualizer concepts.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <Button href="/dashboard" variant="gradient" size="lg">
                    Go to My Dashboard
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  {isAdmin ? (
                    <Button href="/admin" variant="outline" size="lg">
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      Admin Dashboard
                    </Button>
                  ) : null}
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Already Working With Us?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                  Sign in to track your project inquiries and revisit the website concepts
                  you&apos;ve generated with our AI Visualizer.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <Button href="/login" variant="gradient" size="lg">
                    Sign In
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button href="/signup" variant="outline" size="lg">
                    Create Account
                  </Button>
                </div>
              </>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
