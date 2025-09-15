import { Suspense } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardOverview from '@/components/DashboardOverview';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Portfolio Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's an overview of your portfolio content.
            </p>
          </div>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <DashboardOverview />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}