'use client';

import { useEffect, useState } from 'react';
import { getAllTestimonials } from '@/lib/cosmic';
import { Testimonial } from '@/types';
import { truncateText, generateStarRating } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Edit, Trash2, Plus, MessageSquare } from 'lucide-react';

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getAllTestimonials();
      setTestimonials(data);
    } catch (err) {
      setError('Failed to load testimonials');
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
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
          onClick={fetchTestimonials}
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
            All Testimonials ({testimonials.length})
          </h2>
        </div>
        <button className="btn-primary mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="card p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {testimonial.metadata?.client_photo && (
                  <img
                    src={`${testimonial.metadata.client_photo.imgix_url}?w=48&h=48&fit=crop&auto=format,compress`}
                    alt={testimonial.metadata?.client_name || 'Client'}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">
                    {testimonial.metadata?.client_name || 'Anonymous'}
                  </h3>
                  {testimonial.metadata?.client_title && testimonial.metadata?.company && (
                    <p className="text-sm text-gray-600">
                      {testimonial.metadata.client_title} at {testimonial.metadata.company}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-1">
                <button
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit testimonial"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete testimonial"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rating */}
            {testimonial.metadata?.rating && (
              <div className="flex items-center mb-3">
                <span className="text-yellow-400 text-sm mr-2">
                  {generateStarRating(testimonial.metadata.rating)}
                </span>
                <span className="text-sm text-gray-600">
                  {testimonial.metadata.rating}/5
                </span>
              </div>
            )}

            {/* Testimonial Text */}
            <blockquote className="text-gray-700 italic">
              "{truncateText(testimonial.metadata?.testimonial_text || '', 200)}"
            </blockquote>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first client testimonial.</p>
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </button>
        </div>
      )}
    </div>
  );
}