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

export function CallToAction() {
  return (
    <section
      id="get-started"
      className="grid gap-6 rounded-xl border border-border/70 bg-card/50 p-6 shadow-sm backdrop-blur-sm lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="space-y-4">
        <p className="text-sm font-semibold text-primary">Ready to build?</p>
        <h3 className="text-2xl font-semibold tracking-tight">
          Start with the guardrails in place
        </h3>
        <p className="text-base text-muted-foreground">
          Keep page components server-rendered, drop small client components for
          interactivity, and stay within the shared UI primitives to ship
          quickly with consistency.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button as="a" href="#ui-kit">
            Explore UI kit
          </Button>
          <Button as="a" href="#guidelines" variant="outline">
            Read guidelines
          </Button>
        </div>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Request access</CardTitle>
          <CardDescription>
            Minimal form using shared input components to show spacing, focus,
            and tokens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Alex Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">What are you building?</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Short project summary"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="md">
                Submit request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
