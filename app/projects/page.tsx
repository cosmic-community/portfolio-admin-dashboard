import { Suspense } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ProjectsManager from '@/components/ProjectsManager';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">
              Manage your portfolio projects, update details, and track performance.
            </p>
          </div>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <ProjectsManager />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}