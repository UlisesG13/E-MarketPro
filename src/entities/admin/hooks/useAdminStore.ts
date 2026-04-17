import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService, type StoreUpdateInput } from '../services/storeService';
import { toast } from 'sonner';

export function useAdminStore() {
  const queryClient = useQueryClient();

  const { data: store, isLoading } = useQuery({
    queryKey: ['store', 'me'],
    queryFn: () => storeService.get(),
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation({
    mutationFn: (data: StoreUpdateInput) => storeService.update(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['store', 'me'] });
      toast.success('Tienda actualizada');
    },
    onError: () => toast.error('Error al actualizar la tienda'),
  });

  return {
    store: store ?? null,
    isLoading,
    fetchStore: () => queryClient.invalidateQueries({ queryKey: ['store', 'me'] }),
    saveStore: (data: StoreUpdateInput) => updateMutation.mutateAsync(data),
    isSaving: updateMutation.isPending,
  };
}
