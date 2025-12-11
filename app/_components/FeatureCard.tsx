import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-sm transition-all hover:shadow-md',
        className
      )}
    >
      <div className="mb-2 w-fit rounded-full">
        <Icon className="h-10 w-10 text-foreground" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
