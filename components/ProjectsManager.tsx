'use client';

import { useEffect, useState } from 'react';
import { getAllProjects, deleteProject, updateProject } from '@/lib/cosmic';
import { Project } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Briefcase, Plus, Edit, Trash2, ExternalLink, Github, Star } from 'lucide-react';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await getAllProjects();
      setProjects(projectsData as Project[]);
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      setDeleteLoading(projectId);
      await deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project');
    } finally {
      setDeleteLoading(null);
    }
  };

  const toggleFeatured = async (project: Project) => {
    try {
      await updateProject(project.id, {
        featured: !project.metadata?.featured
      });
      setProjects(projects.map(p => 
        p.id === project.id 
          ? { ...p, metadata: { ...p.metadata, featured: !p.metadata?.featured } }
          : p
      ));
    } catch (err) {
      console.error('Error updating project:', err);
      alert('Failed to update project');
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
          <p className="text-gray-600">Manage your portfolio projects</p>
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first project.</p>
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="card p-0 overflow-hidden">
              {/* Project Screenshot */}
              {project.metadata?.screenshot ? (
                <img
                  src={`${project.metadata.screenshot.imgix_url}?w=400&h=200&fit=crop&auto=format,compress`}
                  alt={project.metadata?.project_name || project.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <Briefcase className="w-12 h-12 text-gray-400" />
                </div>
              )}

              <div className="p-6">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {project.metadata?.project_name || project.title}
                    </h3>
                    {project.metadata?.featured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleFeatured(project)}
                      className={`p-1.5 rounded-md transition-colors ${
                        project.metadata?.featured
                          ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                          : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                      }`}
                      title={project.metadata?.featured ? 'Remove from featured' : 'Add to featured'}
                    >
                      <Star className={`w-4 h-4 ${project.metadata?.featured ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deleteLoading === project.id}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
                    >
                      {deleteLoading === project.id ? (
                        <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Project Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.metadata?.short_description || 'No description available'}
                </p>

                {/* Tech Stack */}
                {project.metadata?.tech_stack && project.metadata.tech_stack.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {project.metadata.tech_stack.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.metadata.tech_stack.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                          +{project.metadata.tech_stack.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Project Links */}
                <div className="flex items-center space-x-2">
                  {project.metadata?.live_demo_url && (
                    <a
                      href={project.metadata.live_demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-md text-xs font-medium transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Live Demo
                    </a>
                  )}
                  {project.metadata?.github_url && (
                    <a
                      href={project.metadata.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-md text-xs font-medium transition-colors"
                    >
                      <Github className="w-3 h-3 mr-1" />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}