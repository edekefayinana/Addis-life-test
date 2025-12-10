import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const valueItems = [
  {
    title: 'Server-rendered by default',
    description:
      'Keep data fetching and layout in server components. Only client components need interactivity.',
  },
  {
    title: 'Composable UI kit',
    description:
      'Use the shared button, card, input, label, and textarea primitives to keep visuals consistent.',
  },
  {
    title: 'Readable branching',
    description:
      'Prefer early returns and extracted helpers instead of nested ternaries for maintainable views.',
  },
  {
    title: 'Theme-first styling',
    description:
      'Rely on design tokens (bg-primary, text-muted-foreground, radius) instead of hardcoded values.',
  },
];

export function ValueProps() {
  return (
    <section id="guidelines" className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-primary">
          Why these guardrails
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">
          Consistency without friction
        </h2>
        <p className="max-w-2xl text-base text-muted-foreground">
          These patterns keep the app fast, small, and easy to reason about.
          When in doubt, default to the server, stay within the design tokens,
          and isolate client-side work.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {valueItems.map((item) => (
          <Card key={item.title} className="h-full">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Keep it small, focused, and predictable.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
