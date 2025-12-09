import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function HeroSection() {
  return (
    <section className="space-y-8">
      <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-primary" />
        Server components by default
      </div>

      <div className="space-y-4">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Build fast with a server-first Next.js 16 foundation.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Keep root pages server-rendered, isolate interactivity into small
          client components, and ship a consistent UI kit powered by
          shadcn-inspired primitives.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button as="a" href="#get-started">
            Get started
          </Button>
          <Button as="a" href="#ui-kit" variant="outline">
            View UI kit
          </Button>
        </div>
      </div>

      <Card className="bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Guardrails that stay out of your way</CardTitle>
          <CardDescription>
            Use server components for data and layout, drop in client components
            only where interactivity is required.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <FeatureItem title="Server-first pages">
            Root pages stay server-rendered; interactive islands live in focused
            client components.
          </FeatureItem>
          <FeatureItem title="Lean bundles">
            Avoid unnecessary client code and new deps unless approved; reach
            for existing utilities first.
          </FeatureItem>
          <FeatureItem title="Readable conditionals">
            Use early returns and clear variables instead of nested ternaries
            for maintainability.
          </FeatureItem>
          <FeatureItem title="Design tokens">
            Stick to theme colors and spacing; never hardcode hex values or
            arbitrary pixel paddings.
          </FeatureItem>
        </CardContent>
      </Card>
    </section>
  );
}

const FeatureItem = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="space-y-2 rounded-md border border-border/70 bg-muted/20 p-4">
    <p className="text-sm font-semibold text-foreground">{title}</p>
    <p className="text-sm text-muted-foreground">{children}</p>
    <Link
      className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
      href="#guidelines"
    >
      View guideline
    </Link>
  </div>
);
