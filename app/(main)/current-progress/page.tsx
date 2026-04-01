import { Metadata } from 'next';
import ProgressList from './_components/ProgressList';

export const metadata: Metadata = {
  title: 'Current Progress',
  description: 'View the current construction progress of our projects',
};

export default function CurrentProgressPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Current Progress</h1>
        <p className="text-gray-600">
          Track the latest construction updates across our projects
        </p>
      </div>

      <ProgressList />
    </div>
  );
}
