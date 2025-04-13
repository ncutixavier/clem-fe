'use client';

import { useState } from 'react';
import { useEmployees } from '@/hooks/useEmployees';
import { useCompanies } from '@/hooks/useCompanies';
import { Employee, EmployeeFormData } from '@/models/employee';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function EmployeesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

    const { companies } = useCompanies();
    const {
        employees,
        isLoading,
        error,
        createEmployee,
        updateEmployee,
        deleteEmployee,
        isCreating,
        isUpdating,
        isDeleting
    } = useEmployees(selectedCompanyId);

    const handleCreate = () => {
        setEditingEmployee(null);
        setIsModalOpen(true);
    };

    const handleEdit = (employee: Employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            await deleteEmployee(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data: EmployeeFormData = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            position: formData.get('position') as string,
            department: formData.get('department') as string,
            hireDate: formData.get('hireDate') as string,
            status: formData.get('status') as 'active' | 'inactive',
            companyId: formData.get('companyId') as string,
        };

        if (editingEmployee) {
            await updateEmployee({ id: editingEmployee.id, data });
        } else {
            await createEmployee(data);
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
                    <h1 className="text-xl font-semibold text-gray-900">Employees</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all employees in the system.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        <PlusIcon className="h-5 w-5 inline-block mr-1" />
                        Add employee
                    </button>
                </div>
            </div>

            <div className="mt-4">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Filter by Company
                </label>
                <select
                    id="company"
                    name="company"
                    className="mt-1 block w-full rounded-md border-gray-500 bg-white text-gray-400 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                >
                    <option value="">All Companies</option>
                    {companies?.map((company) => (
                        <option key={company.id} value={company.id}>
                            {company.name}
                        </option>
                    ))}
                </select>
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
                                            Email
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Position
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Department
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Company
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
                                    {employees?.map((employee) => (
                                        <tr key={employee.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {employee.firstName} {employee.lastName}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.email}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.position}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.department}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {companies?.find(c => c.id === employee.companyId)?.name}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {employee.status}
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <button
                                                    onClick={() => handleEdit(employee)}
                                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(employee.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Employee Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 z-30 flex items-center justify-center transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full transform transition-all duration-300 ease-in-out scale-100 opacity-100">
                        <h2 className="text-lg font-medium mb-4 text-gray-500">
                            {editingEmployee ? 'Edit Employee' : 'Add Employee'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            id="firstName"
                                            defaultValue={editingEmployee?.firstName}
                                            required
                                            className="mt-1 p-2.5 text-gray-600 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            id="lastName"
                                            defaultValue={editingEmployee?.lastName}
                                            required
                                            className="mt-1 p-2.5 text-gray-600 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            defaultValue={editingEmployee?.email}
                                            required
                                            className="mt-1 p-2.5 text-gray-600 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            name="phone"
                                            id="phone"
                                            defaultValue={editingEmployee?.phone}
                                            required
                                            className="mt-1 p-2.5 text-gray-600 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                                            Position
                                        </label>
                                        <input
                                            type="text"
                                            name="position"
                                            id="position"
                                            defaultValue={editingEmployee?.position}
                                            required
                                            className="mt-1 p-2.5 text-gray-600 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            name="department"
                                            id="department"
                                            defaultValue={editingEmployee?.department}
                                            required
                                            className="mt-1 p-2.5 text-gray-600 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700">
                                        Hire Date
                                    </label>
                                    <input
                                        type="date"
                                        name="hireDate"
                                        id="hireDate"
                                        defaultValue={editingEmployee?.hireDate}
                                        required
                                        className="mt-1 p-2.5 text-gray-600 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="companyId" className="block text-sm font-medium text-gray-700">
                                        Company
                                    </label>
                                    <select
                                        name="companyId"
                                        id="companyId"
                                        defaultValue={editingEmployee?.companyId}
                                        required
                                        className="mt-1 p-2.5 text-gray-600 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="">Select a company</option>
                                        {companies?.map((company) => (
                                            <option key={company.id} value={company.id}>
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        id="status"
                                        defaultValue={editingEmployee?.status || 'active'}
                                        required
                                        className="mt-1 p-2.5 text-gray-600 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating || isUpdating}
                                    className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    {isCreating || isUpdating ? 'Saving...' : editingEmployee ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
} 