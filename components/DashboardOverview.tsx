import { getDashboardStats, getAllProjects, getAllSkills } from '@/lib/cosmic';
import StatsCard from '@/components/StatsCard';
import ProjectsChart from '@/components/ProjectsChart';
import SkillsChart from '@/components/SkillsChart';
import RecentProjects from '@/components/RecentProjects';
import { BarChart3, Briefcase, Star, Wrench } from 'lucide-react';

export default async function DashboardOverview() {
  const [stats, projects, skills] = await Promise.all([
    getDashboardStats(),
    getAllProjects(),
    getAllSkills()
  ]);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={Briefcase}
          color="blue"
        />
        <StatsCard
          title="Featured Projects"
          value={stats.featuredProjects}
          icon={Star}
          color="yellow"
        />
        <StatsCard
          title="Skills"
          value={stats.totalSkills}
          icon={Wrench}
          color="green"
        />
        <StatsCard
          title="Avg. Rating"
          value={stats.averageRating}
          icon={BarChart3}
          color="purple"
          suffix="/5"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Projects by Tech Stack
          </h3>
          <ProjectsChart projects={projects} />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Skills by Category
          </h3>
          <SkillsChart skills={skills} />
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
          <p className="text-sm text-gray-600 mt-1">
            Your latest portfolio projects
          </p>
        </div>
        <RecentProjects projects={projects.slice(0, 5)} />
      </div>
    </div>
  );
}