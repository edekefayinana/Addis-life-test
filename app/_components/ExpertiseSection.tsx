import { ShieldCheck, Clock, Users, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: ShieldCheck,
    title: 'Secure Transaction',
    description:
      'We ensure every property transfer is legally sound and transparent.',
  },
  {
    icon: Clock,
    title: 'Timely Delivery',
    description: 'Our track record speaks for itself. We value your time.',
  },
  {
    icon: Users,
    title: 'Expert Assessment',
    description: 'Our team of experts evaluates every property for quality.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'We only list properties that meet our high standards.',
  },
];

export function ExpertiseSection() {
  return (
    <section className="bg-slate-900 py-20 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold md:text-4xl text-white">
            Why Choose Our Expertise
          </h2>
          <p className="mt-4 text-slate-300">
            We bring decades of experience and a commitment to excellence to
            every interaction.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => (
            <Card key={idx} className="border-none bg-white text-slate-900">
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
