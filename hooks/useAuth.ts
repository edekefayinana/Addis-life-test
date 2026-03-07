'use client';

import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = !!session;
  const isAdmin = session?.user?.role === 'ADMIN';
  const isAgent = session?.user?.role === 'AGENT';

  return {
    session,
    user: session?.user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isAgent,
    status,
  };
}
