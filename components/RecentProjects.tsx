import Link from 'next/link';
import { Project } from '@/types';
import { formatDate, truncateText } from '@/lib/utils';
import { ExternalLink, Github, Star } from 'lucide-react';

interface RecentProjectsProps {
  projects: Project[];
}

export default function RecentProjects({ projects }: RecentProjectsProps) {
  if (projects.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No projects found. Create your first project to get started.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {projects.map((project) => (
        <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="text-lg font-medium text-gray-900">
                  {project.metadata?.project_name || project.title}
                </h4>
                {project.metadata?.featured && (
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                )}
              </div>
              
              <p className="text-sm text-gray-600 mt-1">
                {truncateText(project.metadata?.short_description || '', 120)}
              </p>
              
              {project.metadata?.tech_stack && project.metadata.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.metadata.tech_stack.slice(0, 4).map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.metadata.tech_stack.length > 4 && (
                    <span className="text-xs text-gray-500">
                      +{project.metadata.tech_stack.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="ml-4 flex flex-col items-end space-y-2">
              <div className="flex space-x-2">
                {project.metadata?.live_demo_url && (
                  <a
                    href={project.metadata.live_demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="View Live Demo"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {project.metadata?.github_url && (
                  <a
                    href={project.metadata.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                    title="View GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {formatDate(project.created_at)}
              </span>
            </div>
          </div>
        </div>
      ))}
      
      <div className="p-4 text-center">
        <Link
          href="/projects"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View all projects →
        </Link>
      </div>
    </div>
  );
}