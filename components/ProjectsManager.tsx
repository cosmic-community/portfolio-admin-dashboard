'use client';

import { useEffect, useState } from 'react';
import { getAllProjects, updateProject, deleteProject, createProject } from '@/lib/cosmic';
import { Project } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Plus, Edit, Trash2, ExternalLink, Github, Star, Briefcase } from 'lucide-react';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await getAllProjects();
      setProjects(projectsData);
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (id: string, updates: Record<string, any>) => {
    try {
      await updateProject(id, updates);
      await fetchProjects(); // Refresh the list
      setEditingProject(null);
    } catch (err) {
      setError('Failed to update project');
      console.error('Error updating project:', err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await deleteProject(id);
      await fetchProjects(); // Refresh the list
    } catch (err) {
      setError('Failed to delete project');
      console.error('Error deleting project:', err);
    }
  };

  const handleCreateProject = async (projectData: Record<string, any>) => {
    try {
      await createProject(projectData);
      await fetchProjects(); // Refresh the list
      setIsCreating(false);
    } catch (err) {
      setError('Failed to create project');
      console.error('Error creating project:', err);
    }
  };

  const toggleFeatured = async (project: Project) => {
    const newFeaturedStatus = !project.metadata?.featured;
    await handleUpdateProject(project.id, {
      featured: newFeaturedStatus
    });
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
      {/* Header with Add Project Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Projects ({projects.length})</h2>
          <p className="text-gray-600">Manage your portfolio projects</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-4">Start building your portfolio by adding your first project.</p>
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="card overflow-hidden">
              {/* Project Screenshot */}
              <div className="aspect-video bg-gray-100 relative">
                {project.metadata?.screenshot ? (
                  <img
                    src={`${project.metadata.screenshot.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
                    alt={project.metadata?.project_name || project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Briefcase className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {/* Featured Badge */}
                {project.metadata?.featured && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                    {project.metadata?.project_name || project.title}
                  </h3>
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={() => toggleFeatured(project)}
                      className={`p-1 rounded ${
                        project.metadata?.featured
                          ? 'text-yellow-600 hover:text-yellow-700'
                          : 'text-gray-400 hover:text-yellow-600'
                      }`}
                      title={project.metadata?.featured ? 'Remove from featured' : 'Add to featured'}
                    >
                      <Star className="w-4 h-4" fill={project.metadata?.featured ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {project.metadata?.short_description || 'No description available'}
                </p>

                {/* Tech Stack */}
                {project.metadata?.tech_stack && project.metadata.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.metadata.tech_stack.slice(0, 3).map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.metadata.tech_stack.length > 3 && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{project.metadata.tech_stack.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {project.metadata?.live_demo_url && (
                      <a
                        href={project.metadata.live_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
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
                        className="text-gray-600 hover:text-gray-800"
                        title="View Source Code"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setEditingProject(project)}
                      className="p-1 text-gray-600 hover:text-blue-600 rounded"
                      title="Edit project"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-1 text-gray-600 hover:text-red-600 rounded"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Order indicator */}
                {project.metadata?.order !== undefined && (
                  <div className="mt-2 text-xs text-gray-500">
                    Order: {project.metadata.order}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {isCreating && (
        <ProjectFormModal
          onSave={handleCreateProject}
          onCancel={() => setIsCreating(false)}
          title="Create New Project"
        />
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <ProjectFormModal
          project={editingProject}
          onSave={(data) => handleUpdateProject(editingProject.id, data)}
          onCancel={() => setEditingProject(null)}
          title="Edit Project"
        />
      )}
    </div>
  );
}

// Project Form Modal Component
interface ProjectFormModalProps {
  project?: Project;
  onSave: (data: Record<string, any>) => void;
  onCancel: () => void;
  title: string;
}

function ProjectFormModal({ project, onSave, onCancel, title }: ProjectFormModalProps) {
  const [formData, setFormData] = useState({
    project_name: project?.metadata?.project_name || '',
    short_description: project?.metadata?.short_description || '',
    detailed_description: project?.metadata?.detailed_description || '',
    tech_stack: project?.metadata?.tech_stack ? project.metadata.tech_stack.join(', ') : '',
    live_demo_url: project?.metadata?.live_demo_url || '',
    github_url: project?.metadata?.github_url || '',
    featured: project?.metadata?.featured || false,
    order: project?.metadata?.order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      tech_stack: formData.tech_stack
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0),
      order: parseInt(formData.order.toString()) || 0,
    };

    onSave(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                value={formData.project_name}
                onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description *
              </label>
              <textarea
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                rows={3}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description
              </label>
              <textarea
                value={formData.detailed_description}
                onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                rows={4}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tech_stack}
                onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                className="input-field"
                placeholder="Next.js, React, TypeScript, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  value={formData.live_demo_url}
                  onChange={(e) => setFormData({ ...formData, live_demo_url: e.target.value })}
                  className="input-field"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="input-field"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                  Featured Project
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {project ? 'Update' : 'Create'} Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}