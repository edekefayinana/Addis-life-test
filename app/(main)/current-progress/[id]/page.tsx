import { Metadata } from 'next';
import ProgressDetail from './_components/ProgressDetail';

export const metadata: Metadata = {
  title: 'Progress Details',
  description: 'View detailed construction progress information',
};

export default async function ProgressDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProgressDetail id={id} />;
}
