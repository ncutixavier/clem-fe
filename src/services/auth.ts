import { UserCredentials, UserProfile, UserRole } from '@/models/user';

// Mock users database
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'password', // In a real app, this would be hashed
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.SUPER_ADMIN,
    isActive: true,
  },
  {
    id: '2',
    email: 'company@example.com',
    password: 'password',
    firstName: 'Company',
    lastName: 'Admin',
    role: UserRole.COMPANY_ADMIN,
    companyId: '1',
    isActive: true,
  },
  {
    id: '3',
    email: 'manager@example.com',
    password: 'password',
    firstName: 'Manager',
    lastName: 'User',
    role: UserRole.MANAGER,
    companyId: '1',
    isActive: true,
  },
  {
    id: '4',
    email: 'employee@example.com',
    password: 'password',
    firstName: 'Employee',
    lastName: 'User',
    role: UserRole.EMPLOYEE,
    companyId: '1',
    isActive: true,
  },
];

// Mock authentication function
export const authenticateUser = async (credentials: UserCredentials): Promise<{ user: UserProfile; token: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.email === credentials.email);
  
  if (!user || user.password !== credentials.password) {
    throw new Error('Invalid credentials');
  }
  
  // Create a user profile without sensitive information
  const userProfile: UserProfile = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    companyId: user.companyId,
    isActive: user.isActive,
  };
  
  // Generate a mock token
  const token = `mock-jwt-token-${user.id}-${Date.now()}`;
  
  return { user: userProfile, token };
};

// Mock function to get current user from token
export const getCurrentUser = async (token: string): Promise<UserProfile | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Extract user ID from token (in a real app, you would verify the token)
  const match = token.match(/mock-jwt-token-(\d+)/);
  if (!match) return null;
  
  const userId = match[1];
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) return null;
  
  // Create a user profile without sensitive information
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    companyId: user.companyId,
    isActive: user.isActive,
  };
}; 