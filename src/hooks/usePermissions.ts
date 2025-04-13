import { useAuth } from './useAuth';
import { UserRole } from '@/models/user';

export function usePermissions() {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Define permission mappings based on user role
    const rolePermissions: Record<UserRole, string[]> = {
      [UserRole.SUPER_ADMIN]: ['manage:companies', 'manage:employees', 'manage:leaves', 'approve:leaves'],
      [UserRole.ADMIN]: ['manage:employees', 'manage:leaves', 'approve:leaves'],
      [UserRole.MANAGER]: ['manage:employees', 'approve:leaves'],
      [UserRole.EMPLOYEE]: ['request:leaves'],
    };

    return rolePermissions[user.role]?.includes(permission) || false;
  };

  return { hasPermission };
} 