import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AuthLayout as Shell } from '@/components/AuthLayout';

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const session = await getServerSession(authOptions);

  // If user is already logged in, redirect to home page
  if (session) {
    redirect('/');
  }

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
