'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useCompanies } from '@/hooks/useCompanies';
import { useReports, useReportGeneration, ReportType, ReportFilters } from '@/hooks/useReports';
import { UserRole } from '@/models/user';
import { format } from 'date-fns';
import {
  ChartBarIcon,
  DocumentChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

export default function ReportsPage() {
  const { user } = useAuth();
  const { companies } = useCompanies();
  const [selectedReport, setSelectedReport] = useState<ReportType>('leave');
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: format(new Date().setMonth(new Date().getMonth() - 1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    type: 'leave',
  });

  const { data: reportData, isLoading } = useReports(filters);
  const { generateReport } = useReportGeneration();

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev: ReportFilters) => ({ ...prev, [name]: value }));
  };

  const handleGenerateReport = async () => {
    try {
      const result = await generateReport(filters);
      if (result.success) {
        // TODO: Handle successful report generation
        console.log('Report generated:', result);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const reportTypes = [
    { value: 'leave', label: 'Leave Reports' },
    { value: 'attendance', label: 'Attendance Reports' },
    { value: 'employee', label: 'Employee Reports' },
    { value: 'company', label: 'Company Reports' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <Button
          onClick={handleGenerateReport}
          leftIcon={<DocumentChartBarIcon className="h-5 w-5" />}
        >
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          variant="default"
          onClick={() => setSelectedReport('leave')}
          className={`cursor-pointer ${
            selectedReport === 'leave' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center space-x-4">
            <CalendarIcon className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="text-lg font-medium">Leave Reports</h3>
              <p className="text-sm text-gray-500">Track leave requests and approvals</p>
            </div>
          </div>
        </Card>

        <Card
          variant="default"
          onClick={() => setSelectedReport('attendance')}
          className={`cursor-pointer ${
            selectedReport === 'attendance' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center space-x-4">
            <ChartBarIcon className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="text-lg font-medium">Attendance Reports</h3>
              <p className="text-sm text-gray-500">Monitor employee attendance</p>
            </div>
          </div>
        </Card>

        <Card
          variant="default"
          onClick={() => setSelectedReport('employee')}
          className={`cursor-pointer ${
            selectedReport === 'employee' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center space-x-4">
            <UserGroupIcon className="h-8 w-8 text-purple-500" />
            <div>
              <h3 className="text-lg font-medium">Employee Reports</h3>
              <p className="text-sm text-gray-500">Employee performance and metrics</p>
            </div>
          </div>
        </Card>

        <Card
          variant="default"
          onClick={() => setSelectedReport('company')}
          className={`cursor-pointer ${
            selectedReport === 'company' ? 'ring-2 ring-blue-500' : ''
          }`}
        >
          <div className="flex items-center space-x-4">
            <DocumentChartBarIcon className="h-8 w-8 text-orange-500" />
            <div>
              <h3 className="text-lg font-medium">Company Reports</h3>
              <p className="text-sm text-gray-500">Company-wide analytics</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Report Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Report Type"
              value={selectedReport}
              onChange={(value) => setSelectedReport(value as ReportType)}
              options={reportTypes}
            />
            <Input
              type="date"
              label="Start Date"
              value={filters.startDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('startDate', e.target.value)}
            />
            <Input
              type="date"
              label="End Date"
              value={filters.endDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange('endDate', e.target.value)}
            />
            {user?.role === UserRole.ADMIN && (
              <Select
                label="Company"
                value={filters.companyId || ''}
                onChange={(value) => handleFilterChange('companyId', value)}
                options={[
                  { value: '', label: 'All Companies' },
                  ...(companies?.map((company) => ({
                    value: company.id,
                    label: company.name,
                  })) || []),
                ]}
              />
            )}
          </div>
        </div>
      </Card>

      {isLoading ? (
        <Card>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </Card>
      ) : reportData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Summary</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Total Requests</p>
                  <p className="text-2xl font-semibold text-blue-700">{reportData.data.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600">Approved</p>
                  <p className="text-2xl font-semibold text-green-700">{reportData.data.approved}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600">Rejected</p>
                  <p className="text-2xl font-semibold text-red-700">{reportData.data.rejected}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600">Pending</p>
                  <p className="text-2xl font-semibold text-yellow-700">{reportData.data.pending}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Leave Types Distribution</h2>
              <div className="space-y-2">
                {Object.entries(reportData.data.byType).map(([type, count]) => (
                  <div key={type} className="flex items-center">
                    <div className="w-32 text-sm text-gray-600">{type}</div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: `${(Number(count) / reportData.data.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-right text-sm text-gray-600">{String(count)}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Monthly Trends</h2>
                <Button
                  variant="ghost"
                  size="medium"
                  leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
                >
                  Export
                </Button>
              </div>
              <div className="h-64">
                <div className="flex h-full items-end space-x-2">
                  {Object.entries(reportData.data.byMonth).map(([month, count]) => (
                    <div key={month} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t"
                        style={{
                          height: `${(Number(count) / Math.max(...Object.values(reportData.data.byMonth).map(Number))) * 100}%`,
                        }}
                      ></div>
                      <div className="text-xs text-gray-500 mt-2">{month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
} 