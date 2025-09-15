import { Suspense } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import TestimonialsManager from '@/components/TestimonialsManager';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function TestimonialsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
            <p className="text-gray-600 mt-1">
              View and manage client testimonials and feedback ratings.
            </p>
          </div>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <TestimonialsManager />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}