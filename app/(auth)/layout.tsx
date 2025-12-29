import type { ReactNode } from 'react';
import { AuthLayout as Shell } from '@/components/AuthLayout';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Shell
      rightPanelContent={{
        title: 'Built for Professional Real Estate Agents in Ethiopia',
        description:
          'Access verified available units, reserve properties in real time, and track your commissions—all from one secure platform.',
      }}
    >
      {children}
    </Shell>
  );
}
