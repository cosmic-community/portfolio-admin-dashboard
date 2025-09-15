import { Suspense } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ServicesManager from '@/components/ServicesManager';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ServicesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-600 mt-1">
              Manage your service offerings, descriptions, and pricing.
            </p>
          </div>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <ServicesManager />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}