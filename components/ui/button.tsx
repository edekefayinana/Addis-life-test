'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';
type ButtonElement = HTMLButtonElement | HTMLAnchorElement;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    as?: 'button' | 'a';
  };

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-ring',
  secondary:
    'bg-secondary text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/90 focus-visible:ring-ring',
  outline:
    'border border-input bg-background text-foreground transition-colors hover:bg-muted focus-visible:ring-ring',
  ghost:
    'text-foreground transition-colors hover:bg-muted focus-visible:ring-ring',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-md px-3 text-sm',
  md: 'h-10 rounded-md px-4 text-sm',
  lg: 'h-11 rounded-lg px-6 text-base',
  icon: 'h-10 w-10 rounded-md p-0',
};

const Button = React.forwardRef<ButtonElement, ButtonProps>(
  (
    {
      as = 'button',
      className,
      variant = 'primary',
      size = 'md',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const Component = as === 'a' ? 'a' : 'button';
    return (
      <Component
        ref={ref as never}
        {...(as === 'button' ? { type } : {})}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
