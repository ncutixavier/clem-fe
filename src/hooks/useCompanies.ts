'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface Company {
  id: string;
  name: string;
  address: string;
  contact: string;
  status: 'active' | 'inactive';
}

interface CreateCompanyData {
  name: string;
  address: string;
  contact: string;
  status: 'active' | 'inactive';
}

// Mock data for development
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    address: '123 Main St, City, Country',
    contact: 'contact@acme.com',
    status: 'active',
  },
  {
    id: '2',
    name: 'Tech Solutions Inc',
    address: '456 Tech Ave, Silicon Valley, USA',
    contact: 'info@techsolutions.com',
    status: 'active',
  },
];

export function useCompanies() {
  const queryClient = useQueryClient();

  // Fetch companies
  const { data: companies, isLoading, error } = useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: async () => {
      // In a real application, this would be an API call
      // const response = await fetch('/api/companies');
      // return response.json();
      return mockCompanies;
    },
  });

  // Create company
  const createCompany = useMutation({
    mutationFn: async (data: CreateCompanyData) => {
      // In a real application, this would be an API call
      // const response = await fetch('/api/companies', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();
      const newCompany: Company = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
      };
      return newCompany;
    },
    onSuccess: (newCompany) => {
      queryClient.setQueryData<Company[]>(['companies'], (old) => {
        return old ? [...old, newCompany] : [newCompany];
      });
    },
  });

  // Update company
  const updateCompany = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Company> }) => {
      // In a real application, this would be an API call
      // const response = await fetch(`/api/companies/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // return response.json();
      return { id, ...data };
    },
    onSuccess: (updatedCompany) => {
      queryClient.setQueryData<Company[]>(['companies'], (old) => {
        return old
          ? old.map((company) =>
              company.id === updatedCompany.id ? { ...company, ...updatedCompany } : company
            )
          : [];
      });
    },
  });

  // Delete company
  const deleteCompany = useMutation({
    mutationFn: async (id: string) => {
      // In a real application, this would be an API call
      // await fetch(`/api/companies/${id}`, {
      //   method: 'DELETE',
      // });
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Company[]>(['companies'], (old) => {
        return old ? old.filter((company) => company.id !== deletedId) : [];
      });
    },
  });

  return {
    companies,
    isLoading,
    error,
    createCompany: (data: CreateCompanyData) => createCompany.mutate(data),
    updateCompany: (id: string, data: Partial<Company>) => updateCompany.mutate({ id, data }),
    deleteCompany: (id: string) => deleteCompany.mutate(id),
  };
} 