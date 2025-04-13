'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { UserRole } from '@/models/user';
import { useAuth } from '@/hooks/useAuth';

interface PermissionsContextType {
  canManageUsers: boolean;
  canManageCompanies: boolean;
  canManageEmployees: boolean;
  canManageLeaveRequests: boolean;
  canViewReports: boolean;
  canManageSettings: boolean;
  userRole: UserRole | null;
  userCompanyId: string | null;
}

const PermissionsContext = createContext<PermissionsContextType>({
  canManageUsers: false,
  canManageCompanies: false,
  canManageEmployees: false,
  canManageLeaveRequests: false,
  canViewReports: false,
  canManageSettings: false,
  userRole: null,
  userCompanyId: null,
});

export const usePermissions = () => useContext(PermissionsContext);

interface PermissionsProviderProps {
  children: ReactNode;
}

export const PermissionsProvider = ({ children }: PermissionsProviderProps) => {
  const { user } = useAuth();
  
  const userRole = user?.role || null;
  const userCompanyId = user?.companyId || null;
  
  // Define permissions based on user role
  const canManageUsers = userRole === UserRole.SUPER_ADMIN;
  const canManageCompanies = userRole === UserRole.SUPER_ADMIN;
  const canManageEmployees = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER].includes(userRole as UserRole);
  const canManageLeaveRequests = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER].includes(userRole as UserRole);
  const canViewReports = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER].includes(userRole as UserRole);
  const canManageSettings = userRole === UserRole.SUPER_ADMIN;
  
  return (
    <PermissionsContext.Provider
      value={{
        canManageUsers,
        canManageCompanies,
        canManageEmployees,
        canManageLeaveRequests,
        canViewReports,
        canManageSettings,
        userRole,
        userCompanyId,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}; 