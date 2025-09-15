'use client';

import { useEffect, useState } from 'react';
import { getProfile, getContactInfo } from '@/lib/cosmic';
import { Profile, ContactInfo } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { User, Mail, Phone, MapPin, Linkedin, Github, Twitter, Edit } from 'lucide-react';

export default function ProfileManager() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [profileData, contactData] = await Promise.all([
        getProfile(),
        getContactInfo()
      ]);
      setProfile(profileData);
      setContactInfo(contactData);
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Error fetching profile:', err);
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
          onClick={fetchProfileData}
          className="mt-2 text-red-600 hover:text-red-800 font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
          <button className="btn-secondary">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>

        {profile ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Photo */}
            <div className="flex flex-col items-center text-center">
              {profile.metadata?.profile_photo ? (
                <img
                  src={`${profile.metadata.profile_photo.imgix_url}?w=150&h=150&fit=crop&auto=format,compress`}
                  alt={profile.metadata?.full_name || 'Profile'}
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <h3 className="text-lg font-medium text-gray-900">
                {profile.metadata?.full_name || 'No name set'}
              </h3>
              <p className="text-gray-600">
                {profile.metadata?.professional_title || 'No title set'}
              </p>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hero Heading
                </label>
                <p className="text-gray-900">
                  {profile.metadata?.hero_heading || 'No hero heading set'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hero Subtext
                </label>
                <p className="text-gray-900">
                  {profile.metadata?.hero_subtext || 'No hero subtext set'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About Me
                </label>
                <p className="text-gray-900">
                  {profile.metadata?.about_me || 'No about me text set'}
                </p>
              </div>

              {profile.metadata?.resume_file && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resume/CV
                  </label>
                  <a
                    href={profile.metadata.resume_file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Download Resume ({profile.metadata.resume_file.name})
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Found</h3>
            <p className="text-gray-600 mb-4">Create your profile to get started.</p>
            <button className="btn-primary">Create Profile</button>
          </div>
        )}
      </div>

      {/* Contact Information */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
          <button className="btn-secondary">
            <Edit className="w-4 h-4 mr-2" />
            Edit Contact Info
          </button>
        </div>

        {contactInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Contact */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h3>
              
              {contactInfo.metadata?.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900">{contactInfo.metadata.email}</p>
                  </div>
                </div>
              )}

              {contactInfo.metadata?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-gray-900">{contactInfo.metadata.phone}</p>
                  </div>
                </div>
              )}

              {contactInfo.metadata?.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-gray-900">{contactInfo.metadata.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
                Social Links
              </h3>
              
              {contactInfo.metadata?.linkedin_url && (
                <div className="flex items-center space-x-3">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">LinkedIn</p>
                    <a
                      href={contactInfo.metadata.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              )}

              {contactInfo.metadata?.github_url && (
                <div className="flex items-center space-x-3">
                  <Github className="w-5 h-5 text-gray-900" />
                  <div>
                    <p className="text-sm text-gray-600">GitHub</p>
                    <a
                      href={contactInfo.metadata.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:text-gray-700"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              )}

              {contactInfo.metadata?.twitter_url && (
                <div className="flex items-center space-x-3">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-600">Twitter</p>
                    <a
                      href={contactInfo.metadata.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-600"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              )}

              {contactInfo.metadata?.portfolio_url && (
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Portfolio</p>
                    <a
                      href={contactInfo.metadata.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      View Website
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Contact Info Found</h3>
            <p className="text-gray-600 mb-4">Add your contact information to get started.</p>
            <button className="btn-primary">Add Contact Info</button>
          </div>
        )}
      </div>
    </div>
  );
}