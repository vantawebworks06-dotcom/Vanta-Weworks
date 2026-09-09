import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/layout/logo";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center py-20 sm:py-28">
      <Container className="max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <Card className="p-7 sm:p-9">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
          <div className="mt-7">{children}</div>
        </Card>
        {footer ? <div className="mt-6 text-center text-sm text-muted">{footer}</div> : null}
      </Container>
    </div>
  );
}
