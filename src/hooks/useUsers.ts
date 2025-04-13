import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User, UserFormData } from '@/models/user';
import { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '@/services/user';

export const useUsers = () => {
  const queryClient = useQueryClient();
  
  // Get all users
  const { 
    data: users = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
  
  // Get user by ID
  const useUser = (id: string) => {
    return useQuery({
      queryKey: ['user', id],
      queryFn: () => getUserById(id),
      enabled: !!id,
    });
  };
  
  // Create user
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
  
  // Update user
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserFormData }) => 
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
  
  // Delete user
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
  
  return {
    users,
    isLoading,
    error,
    useUser,
    createUser: createMutation.mutate,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}; 