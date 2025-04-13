import { User, UserFormData, UserRole } from '@/models/user';

// Mock data for development
let mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.SUPER_ADMIN,
    status: 'active',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'manager@example.com',
    firstName: 'Manager',
    lastName: 'User',
    role: UserRole.MANAGER,
    status: 'active',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
  {
    id: '3',
    email: 'employee@example.com',
    firstName: 'Employee',
    lastName: 'User',
    role: UserRole.EMPLOYEE,
    status: 'active',
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z',
  },
];

// Get all users
export const getUsers = async (): Promise<User[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUsers;
};

// Get user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const user = mockUsers.find(u => u.id === id);
  return user || null;
};

// Create user
export const createUser = async (data: UserFormData): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockUsers.push(newUser);
  return newUser;
};

// Update user
export const updateUser = async (id: string, data: UserFormData): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockUsers.findIndex(u => u.id === id);
  
  if (index === -1) {
    throw new Error('User not found');
  }
  
  const updatedUser: User = {
    ...mockUsers[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  
  mockUsers[index] = updatedUser;
  return updatedUser;
};

// Delete user
export const deleteUser = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockUsers.findIndex(u => u.id === id);
  
  if (index === -1) {
    throw new Error('User not found');
  }
  
  mockUsers = mockUsers.filter(u => u.id !== id);
}; 