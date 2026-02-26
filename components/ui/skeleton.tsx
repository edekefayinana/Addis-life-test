import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-muted rounded-md animate-pulse', className)}
      {...props}
    />
  );
}

export { Skeleton };

export function SkeletonLine({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <Skeleton className={cn('h-4 w-full rounded-full', className)} {...props} />
  );
}

export function SkeletonBlock({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <Skeleton className={cn('h-6 w-full rounded-md', className)} {...props} />
  );
}

export function SkeletonCircle({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <Skeleton className={cn('h-10 w-10 rounded-full', className)} {...props} />
  );
}
