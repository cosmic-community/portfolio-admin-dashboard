import { Suspense } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import SkillsManager from '@/components/SkillsManager';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function SkillsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
            <p className="text-gray-600 mt-1">
              Organize your technical skills by category and proficiency level.
            </p>
          </div>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <SkillsManager />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}