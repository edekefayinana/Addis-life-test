import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-4',
  lg: 'w-10 h-10 border-8',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-t-transparent border-solid border-primary ${sizeMap[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};
