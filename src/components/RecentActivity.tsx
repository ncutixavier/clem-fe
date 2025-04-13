import React from 'react';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Define the activity type
export interface Activity {
  id: string;
  type: 'user' | 'company' | 'leave' | 'document';
  action: 'created' | 'updated' | 'deleted' | 'approved' | 'rejected' | 'pending';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  status?: 'success' | 'error' | 'warning' | 'info';
}

// Dummy data for recent activities
const dummyActivities: Activity[] = [
  {
    id: '1',
    type: 'user',
    action: 'created',
    title: 'New user account created',
    description: 'John Doe was added as a new employee',
    timestamp: '2023-06-15T10:30:00Z',
    user: 'Admin User',
    status: 'success'
  },
  {
    id: '2',
    type: 'company',
    action: 'updated',
    title: 'Company information updated',
    description: 'Acme Corp details were updated',
    timestamp: '2023-06-14T15:45:00Z',
    user: 'Manager User',
    status: 'info'
  },
  {
    id: '3',
    type: 'leave',
    action: 'approved',
    title: 'Leave request approved',
    description: 'Vacation request for Jane Smith was approved',
    timestamp: '2023-06-13T09:20:00Z',
    user: 'HR Manager',
    status: 'success'
  },
  {
    id: '4',
    type: 'leave',
    action: 'rejected',
    title: 'Leave request rejected',
    description: 'Sick leave request for Bob Johnson was rejected',
    timestamp: '2023-06-12T14:10:00Z',
    user: 'HR Manager',
    status: 'error'
  },
  {
    id: '5',
    type: 'document',
    action: 'created',
    title: 'New document uploaded',
    description: 'Q2 Financial Report was uploaded',
    timestamp: '2023-06-11T11:05:00Z',
    user: 'Finance Manager',
    status: 'info'
  },
  {
    id: '6',
    type: 'leave',
    action: 'pending',
    title: 'Leave request pending',
    description: 'Personal leave request for Alice Brown is pending approval',
    timestamp: '2023-06-10T16:30:00Z',
    user: 'Alice Brown',
    status: 'warning'
  },
  {
    id: '7',
    type: 'user',
    action: 'updated',
    title: 'User profile updated',
    description: 'Sarah Wilson updated her profile information',
    timestamp: '2023-06-09T13:15:00Z',
    user: 'Sarah Wilson',
    status: 'info'
  },
  {
    id: '8',
    type: 'company',
    action: 'created',
    title: 'New company added',
    description: 'TechStart Inc was added to the system',
    timestamp: '2023-06-08T10:00:00Z',
    user: 'Admin User',
    status: 'success'
  }
];

// Helper function to get icon based on activity type
const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'user':
      return <UserIcon className="h-5 w-5" />;
    case 'company':
      return <BuildingOfficeIcon className="h-5 w-5" />;
    case 'document':
      return <DocumentTextIcon className="h-5 w-5" />;
    case 'leave':
      return <CalendarIcon className="h-5 w-5" />;
    default:
      return <DocumentTextIcon className="h-5 w-5" />;
  }
};

// Helper function to get status icon
const getStatusIcon = (status?: Activity['status']) => {
  switch (status) {
    case 'success':
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    case 'error':
      return <XCircleIcon className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    default:
      return null;
  }
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

interface RecentActivityProps {
  limit?: number;
  className?: string;
}

export default function RecentActivity({ limit = 5, className = '' }: RecentActivityProps) {
  // Limit the number of activities to display
  const activities = dummyActivities.slice(0, limit);

  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <div key={activity.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                </div>
              </div>
              <div className="flex items-center">
                {getStatusIcon(activity.status)}
                <p className="ml-2 text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              By {activity.user}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 sm:px-6 border-t border-gray-200">
        <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          View all activity
        </a>
      </div>
    </div>
  );
} 