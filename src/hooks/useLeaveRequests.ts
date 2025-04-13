import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LeaveRequest, CreateLeaveRequestData, UpdateLeaveRequestData } from '@/models/leave';

interface UseLeaveRequestsOptions {
  companyId?: string;
  employeeId?: string;
  status?: string;
}

export function useLeaveRequests(options: UseLeaveRequestsOptions | string = {}) {
  // Handle both string and object parameters
  const queryOptions = typeof options === 'string' 
    ? { employeeId: options } 
    : options;

  const queryKey = ['leaveRequests', queryOptions];

  const queryFn = async (): Promise<LeaveRequest[]> => {
    // Mock data - replace with actual API call
    const mockLeaveRequests: LeaveRequest[] = [
      {
        id: '1',
        employeeId: '1',
        leaveTypeId: '1',
        companyId: '1',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-05'),
        status: 'PENDING',
        reason: 'Family vacation',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        employeeId: '2',
        leaveTypeId: '2',
        companyId: '1',
        startDate: new Date('2024-03-10'),
        endDate: new Date('2024-03-12'),
        status: 'APPROVED',
        reason: 'Medical appointment',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        employeeId: '3',
        leaveTypeId: '1',
        companyId: '1',
        startDate: new Date('2024-03-20'),
        endDate: new Date('2024-03-25'),
        status: 'REJECTED',
        reason: 'Personal time',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Filter based on options
    return mockLeaveRequests.filter(request => {
      if (queryOptions.companyId && request.companyId !== queryOptions.companyId) return false;
      if (queryOptions.employeeId && request.employeeId !== queryOptions.employeeId) return false;
      if (queryOptions.status && request.status !== queryOptions.status) return false;
      return true;
    });
  };

  const queryClient = useQueryClient();

  // Fetch leave requests
  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn,
    enabled: true, // Always enable the query to ensure data is returned
  });

  // Create leave request mutation
  const createMutation = useMutation({
    mutationFn: async (data: CreateLeaveRequestData) => {
      // In a real app, this would be an API call
      console.log('Creating leave request:', data);
      return { 
        id: 'new-id', 
        ...data, 
        companyId: queryOptions.companyId,
        status: 'PENDING', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
    },
  });

  // Update leave request mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLeaveRequestData }) => {
      // In a real app, this would be an API call
      console.log('Updating leave request:', id, data);
      return { id, ...data, updatedAt: new Date() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
    },
  });

  // Delete leave request mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // In a real app, this would be an API call
      console.log('Deleting leave request:', id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
    },
  });

  return {
    leaveRequests: data || [], // Ensure we always return an array
    isLoading,
    error,
    createLeaveRequest: createMutation.mutate,
    updateLeaveRequest: updateMutation.mutate,
    deleteLeaveRequest: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
} 