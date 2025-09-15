import { Suspense } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ProfileManager from '@/components/ProfileManager';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">
              Update your professional profile information and contact details.
            </p>
          </div>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <ProfileManager />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}