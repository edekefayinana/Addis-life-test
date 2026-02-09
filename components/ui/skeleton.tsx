import { cn } from '@/lib/utils';

type SkeletonProps = {
  className?: string;
};

export function SkeletonLine({ className = '' }: SkeletonProps) {
  return <div className={cn('h-4 rounded-full bg-slate-200/70', className)} />;
}

export function SkeletonBlock({ className = '' }: SkeletonProps) {
  return <div className={cn('rounded-2xl bg-slate-200/70', className)} />;
}

export function SkeletonCircle({ className = '' }: SkeletonProps) {
  return (
    <div className={cn('h-10 w-10 rounded-full bg-slate-200/70', className)} />
  );
}
