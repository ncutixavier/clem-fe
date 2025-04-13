import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LeaveType } from '@/models/leave';

interface UseLeaveTypesOptions {
  companyId?: string;
}

export function useLeaveTypes(options: UseLeaveTypesOptions = {}) {
  const { companyId } = options;
  const queryClient = useQueryClient();

  // Query key based on filters
  const queryKey = ['leaveTypes', { companyId }];

  // Fetch leave types
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      // In a real app, this would be an API call
      // For now, we'll return mock data
      const mockLeaveTypes: LeaveType[] = [
        {
          id: '1',
          name: 'Annual Leave',
          description: 'Regular paid vacation time',
          companyId: '1',
          defaultDays: 20,
          isPaid: true,
        },
        {
          id: '2',
          name: 'Sick Leave',
          description: 'Time off for medical reasons',
          companyId: '1',
          defaultDays: 10,
          isPaid: true,
        },
        {
          id: '3',
          name: 'Maternity Leave',
          description: 'Leave for expecting mothers',
          companyId: '1',
          defaultDays: 90,
          isPaid: true,
        },
        {
          id: '4',
          name: 'Unpaid Leave',
          description: 'Leave without pay',
          companyId: '1',
          isPaid: false,
        },
      ];

      // Filter based on company ID
      return mockLeaveTypes.filter(type => !companyId || type.companyId === companyId);
    },
    enabled: !!companyId,
  });

  // Create leave type mutation
  const createMutation = useMutation({
    mutationFn: async (data: Omit<LeaveType, 'id'>) => {
      // In a real app, this would be an API call
      console.log('Creating leave type:', data);
      return { id: 'new-id', ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveTypes'] });
    },
  });

  // Update leave type mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LeaveType> }) => {
      // In a real app, this would be an API call
      console.log('Updating leave type:', id, data);
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveTypes'] });
    },
  });

  // Delete leave type mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // In a real app, this would be an API call
      console.log('Deleting leave type:', id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveTypes'] });
    },
  });

  return {
    leaveTypes: data,
    isLoading,
    error,
    createLeaveType: createMutation.mutate,
    updateLeaveType: updateMutation.mutate,
    deleteLeaveType: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
} 