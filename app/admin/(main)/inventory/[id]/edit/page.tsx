import { PropertyForm } from '@/components/inventory/PropertyForm';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
interface Props {
  params: { id: string };
}

export const generateMetadata = async ({ params }: Props) => {
  const { id } = await params;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ''}/inventory/${id}`,
      {
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      return {
        title: 'Edit Property - Addis Life Agent',
        description: 'Edit property details in your inventory.',
      };
    }
    const property = await res.json();

    return {
      title: `Edit ${property.title} - Addis Life Agent`,
      description: `Edit details for ${property.title} in your inventory.`,
    };
  } catch {
    return {
      title: 'Edit Property - Addis Life Agent',
      description: 'Edit property details in your inventory.',
    };
  }
};

export default async function PropertyEditPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session?.user) {
    redirect('/login');
  }

  // Only allow ADMIN role to create properties
  if (session.user.role !== 'ADMIN') {
    redirect('/admin/inventory');
  }

  const { id } = await params; // Ensure params is properly destructured
  // Replace with your actual API endpoint or DB call
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || ''}/inventory/${id}`,
    {
      cache: 'no-store',
    }
  );
  if (!res.ok) return notFound();
  const property = await res.json();

  // Transform property for form initialData if needed (handled in PropertyForm)
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <PropertyForm initialData={property.data} mode="edit" />
      </div>
    </div>
  );
}
