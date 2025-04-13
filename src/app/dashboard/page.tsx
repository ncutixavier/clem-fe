'use client';

import { useState } from 'react';
import { useAuth, useCompanies, useEmployees, useLeaveRequests } from '@/hooks';
import { usePermissions } from '@/contexts/PermissionsContext';
import RecentActivity from '@/components/RecentActivity';
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user } = useAuth();
  const { userCompanyId } = usePermissions();
  const { companies } = useCompanies();
  const { employees } = useEmployees(userCompanyId || undefined);
  const { leaveRequests, isLoading: isLoadingLeaveRequests } = useLeaveRequests({ companyId: userCompanyId || undefined });

  // Count statistics
  const companyCount = companies?.length || 0;
  const employeeCount = employees?.length || 0;
  const pendingLeaveCount = leaveRequests?.filter((request: { status: string }) => request.status === 'PENDING').length || 0;
  const documentCount = 12; // Dummy data for now

  return (
    <div className="py-6">
      <div className="mx-auto max-w-full">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your system
        </p>
      </div>
      <div className="mx-auto max-w-full">
        <div className="py-4">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Company Stats */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="rounded-md bg-blue-500 p-3">
                    <BuildingOfficeIcon className="h-6 w-6 text-gray-100" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Companies</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{companyCount}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a href="/dashboard/companies" className="font-medium text-blue-700 hover:text-blue-900">
                    View all
                  </a>
                </div>
              </div>
            </div>

            {/* Employee Stats */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="rounded-md bg-blue-500 p-3">
                    <UserGroupIcon className="h-6 w-6 text-gray-100" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Employees</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{employeeCount}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a href="/dashboard/employees" className="font-medium text-blue-700 hover:text-blue-900">
                    View all
                  </a>
                </div>
              </div>
            </div>

            {/* Leave Requests Stats */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="rounded-md bg-blue-500 p-3">
                    <CalendarIcon className="h-6 w-6 text-gray-100" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Pending Leave Requests</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{pendingLeaveCount}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a href="/dashboard/leave-requests" className="font-medium text-blue-700 hover:text-blue-900">
                    View all
                  </a>
                </div>
              </div>
            </div>

            {/* Documents Stats */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="rounded-md bg-blue-500 p-3">
                    <DocumentTextIcon className="h-6 w-6 text-gray-100" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">Documents</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{documentCount}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <a href="/dashboard/documents" className="font-medium text-blue-700 hover:text-blue-900">
                    View all
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <RecentActivity limit={5} />
        </div>
      </div>
    </div>
  );
} 