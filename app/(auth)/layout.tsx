import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AuthLayout as Shell } from '@/components/AuthLayout';
import { getTranslations } from 'next-intl/server';

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const session = await getServerSession(authOptions);

  // If user is already logged in, redirect to home page
  if (session) {
    redirect('/');
  }

  const t = await getTranslations('authLayout');

  return (
    <Shell
      rightPanelContent={{
        title: t('title'),
        description: t('description'),
      }}
    >
      {children}
    </Shell>
  );
}
