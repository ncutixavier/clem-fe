import { Employee, EmployeeFormData } from '@/models/employee';

// Mock data for development
let mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    position: 'Software Engineer',
    department: 'Engineering',
    hireDate: '2023-01-15',
    status: 'active',
    companyId: '1',
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-01-15T00:00:00Z',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    position: 'Product Manager',
    department: 'Product',
    hireDate: '2023-02-20',
    status: 'active',
    companyId: '1',
    createdAt: '2023-02-20T00:00:00Z',
    updatedAt: '2023-02-20T00:00:00Z',
  },
];

// Get all employees
export const getEmployees = async (companyId?: string): Promise<Employee[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (companyId) {
    return mockEmployees.filter(employee => employee.companyId === companyId);
  }
  
  return mockEmployees;
};

// Get employee by ID
export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const employee = mockEmployees.find(emp => emp.id === id);
  return employee || null;
};

// Create employee
export const createEmployee = async (data: EmployeeFormData): Promise<Employee> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newEmployee: Employee = {
    id: (mockEmployees.length + 1).toString(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockEmployees.push(newEmployee);
  return newEmployee;
};

// Update employee
export const updateEmployee = async (id: string, data: EmployeeFormData): Promise<Employee> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockEmployees.findIndex(emp => emp.id === id);
  
  if (index === -1) {
    throw new Error('Employee not found');
  }
  
  const updatedEmployee: Employee = {
    ...mockEmployees[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  mockEmployees[index] = updatedEmployee;
  return updatedEmployee;
};

// Delete employee
export const deleteEmployee = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockEmployees.findIndex(emp => emp.id === id);
  
  if (index === -1) {
    throw new Error('Employee not found');
  }
  
  mockEmployees = mockEmployees.filter(emp => emp.id !== id);
}; 