import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function DeveloperSection() {
  return (
    <section className="container mx-auto grid gap-12 py-16 px-4 md:grid-cols-2 lg:px-6 items-center">
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1000&auto=format&fit=crop" // Placeholder meeting/office image
          alt="Developer Team"
          width={600}
          height={400}
          className="w-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold">Your Trusted Property Developer</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            With over 10 years of experience in the real estate market, Addis
            Life has established itself as a leader in property development,
            delivering premium spaces that inspire and elevate everyday living.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 border-y py-6">
          <div>
            <h3 className="text-3xl font-bold text-primary">10,000+</h3>
            <p className="text-sm text-muted-foreground">Units Delivered</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-primary">10+</h3>
            <p className="text-sm text-muted-foreground">Years Experience</p>
          </div>
        </div>

        <Button size="lg" className="w-fit">
          Learn More
        </Button>
      </div>
    </section>
  );
}
