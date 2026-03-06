import { Sidebar } from '@/components/Sidebar';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TopBar } from '@/components/Topbar';

export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  const title =
    session?.user?.role === 'ADMIN' ? 'Admin Dashboard' : 'Agent Dashboard';

  return {
    title,
    description:
      'A dashboard to monitor and manage your real estate activities.',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
