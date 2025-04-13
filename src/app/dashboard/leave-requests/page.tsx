'use client';

import { useState } from 'react';
import { useLeaveRequests, useLeaveTypes, useEmployees } from '@/hooks';
import { usePermissions } from '@/contexts/PermissionsContext';
import { LeaveRequest, LeaveStatus } from '@/models/leave';
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Input, Select, Button } from '@/components/ui';
import { format } from 'date-fns';

export default function LeaveRequestsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState<LeaveRequest | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<LeaveStatus | ''>('');

    const { userCompanyId, canManageCompanies } = usePermissions();
    const { leaveTypes } = useLeaveTypes({ companyId: userCompanyId || undefined });
    const { employees } = useEmployees(userCompanyId || undefined);
    const {
        leaveRequests,
        isLoading,
        error,
        createLeaveRequest,
        updateLeaveRequest,
        deleteLeaveRequest,
        isCreating,
        isUpdating,
        isDeleting
    } = useLeaveRequests({
        companyId: userCompanyId || undefined,
        status: selectedStatus || undefined
    });

    const handleCreate = () => {
        setEditingRequest(null);
        setIsModalOpen(true);
    };

    const handleEdit = (request: LeaveRequest) => {
        setEditingRequest(request);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this leave request?')) {
            await deleteLeaveRequest(id);
        }
    };

    const handleApprove = async (id: string) => {
        await updateLeaveRequest({
            id,
            data: {
                status: 'APPROVED',
                approvedBy: 'current-user-id', // In a real app, this would be the actual user ID
                approvedAt: new Date()
            }
        });
    };

    const handleReject = async (id: string) => {
        await updateLeaveRequest({
            id,
            data: {
                status: 'REJECTED',
                approvedBy: 'current-user-id', // In a real app, this would be the actual user ID
                approvedAt: new Date()
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data = {
            employeeId: formData.get('employeeId') as string,
            leaveTypeId: formData.get('leaveTypeId') as string,
            startDate: new Date(formData.get('startDate') as string),
            endDate: new Date(formData.get('endDate') as string),
            reason: formData.get('reason') as string,
        };

        if (editingRequest) {
            await updateLeaveRequest({ id: editingRequest.id, data: data as any });
        } else {
            await createLeaveRequest(data);
        }

        setIsModalOpen(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Leave Requests</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all leave requests in the system.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Button
                        onClick={handleCreate}
                        leftIcon={<PlusIcon className="h-5 w-5" />}
                    >
                        Request Leave
                    </Button>
                </div>
            </div>

            <div className="mt-4">
                <Select
                    label="Filter by Status"
                    id="status"
                    name="status"
                    value={selectedStatus}
                    onChange={(value) => setSelectedStatus(value as LeaveStatus | '')}
                    options={[
                        { value: '', label: 'All Statuses' },
                        { value: 'PENDING', label: 'Pending' },
                        { value: 'APPROVED', label: 'Approved' },
                        { value: 'REJECTED', label: 'Rejected' }
                    ]}
                />
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Employee
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Leave Type
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Start Date
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            End Date
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Reason
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {leaveRequests?.map((request) => {
                                        const employee = employees?.find(e => e.id === request.employeeId);
                                        const leaveType = leaveTypes?.find(lt => lt.id === request.leaveTypeId);

                                        return (
                                            <tr key={request.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown'}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {leaveType?.name || 'Unknown'}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {format(new Date(request.startDate), 'MMM d, yyyy')}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {format(new Date(request.endDate), 'MMM d, yyyy')}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {request.reason}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${request.status === 'APPROVED'
                                                            ? 'bg-green-100 text-green-800'
                                                            : request.status === 'REJECTED'
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {request.status}
                                                    </span>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    {request.status === 'PENDING' && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => handleApprove(request.id)}
                                                                className="mr-2"
                                                                leftIcon={<CheckIcon className="h-5 w-5 text-green-600" />}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => handleReject(request.id)}
                                                                className="mr-2"
                                                                leftIcon={<XMarkIcon className="h-5 w-5 text-red-600" />}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleEdit(request)}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                    >
                                                        <PencilIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(request.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leave Request Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 z-30 flex items-center justify-center transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full transform transition-all duration-300 ease-in-out scale-100 opacity-100">
                        <h2 className="text-lg font-medium mb-4 text-gray-500">
                            {editingRequest ? 'Edit Leave Request' : 'Request Leave'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <Select
                                    label="Employee"
                                    name="employeeId"
                                    id="employeeId"
                                    defaultValue={editingRequest?.employeeId}
                                    required
                                    options={employees?.map(employee => ({
                                        value: employee.id,
                                        label: `${employee.firstName} ${employee.lastName}`
                                    })) || []}
                                />

                                <Select
                                    label="Leave Type"
                                    name="leaveTypeId"
                                    id="leaveTypeId"
                                    defaultValue={editingRequest?.leaveTypeId}
                                    required
                                    options={leaveTypes?.map(type => ({
                                        value: type.id,
                                        label: type.name
                                    })) || []}
                                />

                                <Input
                                    label="Start Date"
                                    name="startDate"
                                    id="startDate"
                                    type="date"
                                    defaultValue={editingRequest ? format(new Date(editingRequest.startDate), 'yyyy-MM-dd') : ''}
                                    required
                                />

                                <Input
                                    label="End Date"
                                    name="endDate"
                                    id="endDate"
                                    type="date"
                                    defaultValue={editingRequest ? format(new Date(editingRequest.endDate), 'yyyy-MM-dd') : ''}
                                    required
                                />

                                <Input
                                    label="Reason"
                                    name="reason"
                                    id="reason"
                                    defaultValue={editingRequest?.reason}
                                    required
                                />
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsModalOpen(false)}
                                    type="button"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    isLoading={isCreating || isUpdating}
                                >
                                    {editingRequest ? 'Update' : 'Submit'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
} 