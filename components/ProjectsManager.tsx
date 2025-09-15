'use client';

import { useEffect, useState } from 'react';
import { getAllProjects, updateProject, deleteProject } from '@/lib/cosmic';
import { Project } from '@/types';
import { formatDate, truncateText } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Star, ExternalLink, Github, Edit, Trash2, Plus } from 'lucide-react';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      await updateProject(project.id, {
        featured: !project.metadata?.featured
      });
      
      // Update local state
      setProjects(prev => prev.map(p => 
        p.id === project.id 
          ? { ...p, metadata: { ...p.metadata, featured: !p.metadata?.featured } }
          : p
      ));
    } catch (err) {
      console.error('Error updating project:', err);
      alert('Failed to update project');
    }
  };

  const handleDeleteProject = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.metadata?.project_name || project.title}"?`)) {
      return;
    }

    try {
      await deleteProject(project.id);
      setProjects(prev => prev.filter(p => p.id !== project.id));
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={fetchProjects}
          className="mt-2 text-red-600 hover:text-red-800 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">
            All Projects ({projects.length})
          </h2>
        </div>
        <button className="btn-primary mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="card p-6">
            {/* Project Image */}
            {project.metadata?.screenshot && (
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <img
                  src={`${project.metadata.screenshot.imgix_url}?w=400&h=225&fit=crop&auto=format,compress`}
                  alt={project.metadata?.project_name || project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Project Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-900">
                    {project.metadata?.project_name || project.title}
                  </h3>
                  {project.metadata?.featured && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(project.created_at)}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">
              {truncateText(project.metadata?.short_description || '', 100)}
            </p>

            {/* Tech Stack */}
            {project.metadata?.tech_stack && project.metadata.tech_stack.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {project.metadata.tech_stack.slice(0, 3).map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tech}
                  </span>
                ))}
                {project.metadata.tech_stack.length > 3 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{project.metadata.tech_stack.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Links */}
            <div className="flex items-center justify-between">
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

              {/* Actions */}
              <div className="flex space-x-1">
                <button
                  onClick={() => handleToggleFeatured(project)}
                  className={`p-2 rounded transition-colors ${
                    project.metadata?.featured
                      ? 'text-yellow-600 hover:text-yellow-700'
                      : 'text-gray-400 hover:text-yellow-600'
                  }`}
                  title={project.metadata?.featured ? 'Remove from featured' : 'Mark as featured'}
                >
                  <Star className={`w-4 h-4 ${project.metadata?.featured ? 'fill-current' : ''}`} />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit project"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProject(project)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first project.</p>
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </button>
        </div>
      )}
    </div>
  );
}