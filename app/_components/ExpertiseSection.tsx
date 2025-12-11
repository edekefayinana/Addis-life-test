import {
  CircleUserRound,
  HandCoins,
  ShieldCheck,
  UserCheck,
  Hexagon,
  Globe,
  Zap,
  Triangle,
  Component,
} from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    icon: CircleUserRound,
    title: 'Trusted Expertise',
    description: 'Years of experience to guide your property decisions.',
  },
  {
    icon: HandCoins,
    title: 'Affordable Wide Selection',
    description: 'Homes, apartments, and commercial spaces to suit every need.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality & Safety',
    description:
      'Durable, well-inspected properties in secure, welcoming communities.',
  },
  {
    icon: UserCheck,
    title: 'Experienced agents',
    description: 'Find an experienced agent who knows your market best.',
  },
];

const partners = [
  { name: 'Lumina', icon: Hexagon },
  { name: 'Vortex', icon: Globe },
  { name: 'Velocity', icon: Zap },
  { name: 'Synergy', icon: Triangle },
  { name: 'Enigma', icon: Component },
  { name: 'Spectrum', icon: Hexagon },
];

export function ExpertiseSection() {
  return (
    <section className="bg-brand-dark py-20 text-white rounded-lg">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          {/* Left Text Content */}
          <div className="flex flex-col justify-center lg:col-span-5">
            <h2 className="text-4xl font-bold leading-tight md:text-5xl">
              Why Choose Our Expertise
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              We make finding your perfect property simple, secure, and
              stress-free. With expert guidance, personalized support, and a
              wide range of options, we help you make the right choice with
              confidence.
            </p>
          </div>

          {/* Right Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {features.map((feature, idx) => (
              <FeatureCard
                key={idx}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                className="h-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="mt-24 border-t border-white/10 pt-12 text-center w-full">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="mb-8 text-sm font-medium text-slate-400">
            Trusted by 10+ Industry Partners
          </p>
          <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex min-w-full shrink-0 animate-scroll items-center gap-12 py-4 hover:[animation-play-state:paused]">
              {[...partners, ...partners, ...partners, ...partners].map(
                (partner, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <partner.icon className="h-6 w-6 grayscale transition-all duration-500 hover:grayscale-0" />
                    <span className="text-lg font-semibold grayscale transition-all duration-500 hover:grayscale-0">
                      {partner.name}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
