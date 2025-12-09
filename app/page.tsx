import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CallToAction } from './_components/CallToAction';
import { HeroSection } from './_components/HeroSection';
import { ValueProps } from './_components/ValueProps';

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-12 sm:py-16 lg:px-10">
        <HeroSection />
        <ValueProps />
        <UiKitPreview />
        <CallToAction />
      </main>
    </div>
  );
}

function UiKitPreview() {
  return (
    <section id="ui-kit" className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-primary">UI kit</p>
        <h2 className="text-3xl font-semibold tracking-tight">
          Shadcn-inspired primitives
        </h2>
        <p className="max-w-2xl text-base text-muted-foreground">
          Shared components live in{' '}
          <code className="font-mono text-sm">/components/ui</code>. Keep
          page-specific pieces inside the page folder&apos;s{' '}
          <code className="font-mono text-sm">_components</code> directory.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>
              Primary, secondary, outline, and ghost variants.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inputs & label</CardTitle>
            <CardDescription>
              Consistent spacing, focus states, and tokenized colors.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="preview-name">Full name</Label>
              <Input id="preview-name" placeholder="Maya Alemu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preview-notes">Notes</Label>
              <Textarea id="preview-notes" placeholder="Quick context here" />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
