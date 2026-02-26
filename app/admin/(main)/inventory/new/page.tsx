import { PropertyForm } from '@/components/inventory/PropertyForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Create New Property',
  description: 'Add a new property to the inventory',
};

export default async function PropertyCreatePage() {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session?.user) {
    redirect('/login');
  }

  // Only allow ADMIN role to create properties
  if (session.user.role !== 'ADMIN') {
    redirect('/inventory');
  }

  const initialData = null;

  // Modal state (client component)
  // This is a workaround for Next.js server/client split; in real app, move modal to client component
  // For now, just render the form and modal trigger
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        {/* Project Modal trigger and modal */}
        {/* In a real app, move this to a client component and use useState for modal open/close */}
        {/* <Button onClick={() => setProjectModalOpen(true)}>Create Project</Button> */}
        {/* <ProjectModal open={projectModalOpen} onClose={() => setProjectModalOpen(false)} onProjectCreated={...} /> */}
        <PropertyForm initialData={initialData} />
      </div>
    </div>
  );
}
