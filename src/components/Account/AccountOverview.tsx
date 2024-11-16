import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUserProfile } from '../../hooks/useUserProfile';
import { CreditCard, Settings, FileText } from 'lucide-react';

export default function AccountOverview() {
  const user = useAuthStore((state) => state.user);
  const { profile, loading, error } = useUserProfile();

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Account Overview</h2>
          <p className="mt-2 text-gray-600">Manage your account settings and view your applications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Profile Information</h3>
              <Link to="/account/settings" className="text-primary-600 hover:text-primary-700">
                <Settings className="h-5 w-5" />
              </Link>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-medium">Name:</span>{' '}
                {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'Not set'}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span> {profile?.phone || 'Not set'}
              </p>
            </div>
          </div>

          {/* Payment Methods Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Payment Methods</h3>
              <Link to="/account/settings#payment" className="text-primary-600 hover:text-primary-700">
                <CreditCard className="h-5 w-5" />
              </Link>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600">Manage your saved payment methods</p>
              <Link
                to="/account/settings#payment"
                className="inline-flex items-center text-primary-600 hover:text-primary-700"
              >
                View saved cards
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>

          {/* Applications Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Applications</h3>
              <Link to="/applications" className="text-primary-600 hover:text-primary-700">
                <FileText className="h-5 w-5" />
              </Link>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600">View and manage your loan applications</p>
              <Link
                to="/applications"
                className="inline-flex items-center text-primary-600 hover:text-primary-700"
              >
                View applications
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}