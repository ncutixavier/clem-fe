import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Employee, EmployeeFormData } from '@/models/employee';
import { 
  getEmployees, 
  getEmployeeById, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee 
} from '@/services/employee';

export const useEmployees = (companyId?: string) => {
  const queryClient = useQueryClient();
  
  // Get all employees
  const { 
    data: employees = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['employees', companyId],
    queryFn: () => getEmployees(companyId),
  });
  
  // Get employee by ID
  const useEmployee = (id: string) => {
    return useQuery({
      queryKey: ['employee', id],
      queryFn: () => getEmployeeById(id),
      enabled: !!id,
    });
  };
  
  // Create employee
  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
  
  // Update employee
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeFormData }) => 
      updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
  
  // Delete employee
  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
  
  return {
    employees,
    isLoading,
    error,
    useEmployee,
    createEmployee: createMutation.mutate,
    updateEmployee: updateMutation.mutate,
    deleteEmployee: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}; 