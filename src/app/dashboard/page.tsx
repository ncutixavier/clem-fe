'use client';

import { useAuth } from '@/hooks/useAuth';
import { useCompanies } from '@/hooks/useCompanies';
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user } = useAuth();
  const { companies, isLoading: companiesLoading } = useCompanies();

  // Mock data for dashboard stats
  const stats = [
    { name: 'Total Companies', value: companies?.length || 0, icon: BuildingOfficeIcon },
    { name: 'Total Employees', value: '0', icon: UserGroupIcon },
    { name: 'Pending Leave Requests', value: '0', icon: CalendarIcon },
    { name: 'Reports Generated', value: '0', icon: ChartBarIcon },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome, {user?.firstName}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your system
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <p className="text-sm text-gray-500">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 