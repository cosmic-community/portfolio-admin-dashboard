'use client';

import { useEffect, useState } from 'react';
import { getAllSkills, updateSkill, deleteSkill } from '@/lib/cosmic';
import { Skill } from '@/types';
import { getSkillCategoryColor, getProficiencyColor } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Edit, Trash2, Plus, Wrench } from 'lucide-react';

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await getAllSkills();
      setSkills(data);
    } catch (err) {
      setError('Failed to load skills');
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (skill: Skill) => {
    if (!confirm(`Are you sure you want to delete "${skill.metadata?.skill_name || skill.title}"?`)) {
      return;
    }

    try {
      await deleteSkill(skill.id);
      setSkills(prev => prev.filter(s => s.id !== skill.id));
    } catch (err) {
      console.error('Error deleting skill:', err);
      alert('Failed to delete skill');
    }
  };

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.metadata?.category?.value || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categories = ['all', ...Object.keys(skillsByCategory)];
  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skillsByCategory[selectedCategory] || [];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={fetchSkills}
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
            All Skills ({skills.length})
          </h2>
        </div>
        <button className="btn-primary mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {category === 'all' ? 'All Categories' : category}
            {category !== 'all' && (
              <span className="ml-2 text-xs">
                ({skillsByCategory[category]?.length || 0})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSkills.map((skill) => (
          <div key={skill.id} className="card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">
                  {skill.metadata?.skill_name || skill.title}
                </h3>
                {skill.metadata?.category && (
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    getSkillCategoryColor(skill.metadata.category.value)
                  }`}>
                    {skill.metadata.category.value}
                  </span>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex space-x-1 ml-2">
                <button
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit skill"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSkill(skill)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Proficiency Level */}
            {skill.metadata?.proficiency_level && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Proficiency</span>
                  <span>{skill.metadata.proficiency_level.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProficiencyColor(skill.metadata.proficiency_level.key)}`}
                    style={{
                      width: `${
                        skill.metadata.proficiency_level.key === 'expert' ? '100%' :
                        skill.metadata.proficiency_level.key === 'advanced' ? '75%' :
                        skill.metadata.proficiency_level.key === 'intermediate' ? '50%' : '25%'
                      }`
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Icon */}
            {skill.metadata?.icon && (
              <div className="mt-3 flex justify-center">
                <img
                  src={`${skill.metadata.icon.imgix_url}?w=32&h=32&fit=crop&auto=format,compress`}
                  alt={`${skill.metadata?.skill_name || skill.title} icon`}
                  className="w-8 h-8 object-contain"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedCategory === 'all' ? 'No skills found' : `No skills in ${selectedCategory} category`}
          </h3>
          <p className="text-gray-600 mb-4">
            {selectedCategory === 'all' 
              ? 'Get started by adding your first skill.'
              : 'Try selecting a different category or add a new skill.'
            }
          </p>
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </button>
        </div>
      )}
    </div>
  );
}