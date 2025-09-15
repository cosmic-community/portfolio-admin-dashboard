'use client';

import { useEffect, useState } from 'react';
import { getAllServices } from '@/lib/cosmic';
import { Service } from '@/types';
import { truncateText } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Edit, Trash2, Plus, Settings } from 'lucide-react';

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getAllServices();
      setServices(data);
    } catch (err) {
      setError('Failed to load services');
      console.error('Error fetching services:', err);
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
          onClick={fetchServices}
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
            All Services ({services.length})
          </h2>
        </div>
        <button className="btn-primary mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="card p-6">
            {/* Service Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {service.metadata?.icon && (
                  <span className="text-2xl">{service.metadata.icon}</span>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {service.metadata?.service_name || service.title}
                  </h3>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-1 ml-2">
                <button
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit service"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">
              {truncateText(service.metadata?.description || '', 120)}
            </p>

            {/* Price Range */}
            {service.metadata?.price_range && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Price Range</span>
                  <span className="font-medium text-gray-900">
                    {service.metadata.price_range}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first service offering.</p>
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </button>
        </div>
      )}
    </div>
  );
}