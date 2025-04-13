'use client';

import { useState } from 'react';
import { useLeaveTypes } from '@/hooks/useLeaveTypes';
import { usePermissions } from '@/contexts/PermissionsContext';
import { LeaveType } from '@/models/leave';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Input, Select, Button, Checkbox } from '@/components/ui';

export default function LeaveTypesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<LeaveType | null>(null);

  const { userCompanyId, canManageCompanies } = usePermissions();
  const {
    leaveTypes,
    isLoading,
    error,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType,
    isCreating,
    isUpdating,
    isDeleting
  } = useLeaveTypes({ companyId: userCompanyId || undefined });

  const handleCreate = () => {
    setEditingType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (type: LeaveType) => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this leave type?')) {
      await deleteLeaveType(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      companyId: userCompanyId || '',
      defaultDays: formData.get('defaultDays') ? parseInt(formData.get('defaultDays') as string) : undefined,
      isPaid: formData.get('isPaid') === 'on',
    };

    if (editingType) {
      await updateLeaveType({ id: editingType.id, data: data as any });
    } else {
      await createLeaveType(data as any);
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
          <h1 className="text-xl font-semibold text-gray-900">Leave Types</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all leave types in the system.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button
            onClick={handleCreate}
            leftIcon={<PlusIcon className="h-5 w-5" />}
          >
            Add Leave Type
          </Button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Description
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Default Days
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Paid
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {leaveTypes?.map((type) => (
                    <tr key={type.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {type.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {type.description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {type.defaultDays || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          type.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {type.isPaid ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Button
                          variant="ghost"
                          onClick={() => handleEdit(type)}
                          className="mr-2"
                          leftIcon={<PencilIcon className="h-5 w-5" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(type.id)}
                          leftIcon={<TrashIcon className="h-5 w-5" />}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Type Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 flex items-center justify-center transition-opacity duration-300 ease-in-out">
          <div className="bg-white rounded-lg p-6 max-w-md w-full transform transition-all duration-300 ease-in-out scale-100 opacity-100">
            <h2 className="text-lg font-medium mb-4 text-gray-500">
              {editingType ? 'Edit Leave Type' : 'Add Leave Type'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  label="Name"
                  name="name"
                  id="name"
                  defaultValue={editingType?.name}
                  required
                />
                
                <Input
                  label="Description"
                  name="description"
                  id="description"
                  defaultValue={editingType?.description}
                />
                
                <Input
                  label="Default Days"
                  name="defaultDays"
                  id="defaultDays"
                  type="number"
                  min="0"
                  defaultValue={editingType?.defaultDays?.toString()}
                />
                
                <Checkbox
                  label="Paid Leave"
                  name="isPaid"
                  id="isPaid"
                  defaultChecked={editingType?.isPaid}
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
                  {editingType ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 