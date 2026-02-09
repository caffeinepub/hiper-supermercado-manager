import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, StoreSectorSnapshot, Product, Delivery } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCreateStore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.createStore();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store'] });
    },
  });
}

export function useGetSectors() {
  const { actor, isFetching } = useActor();

  return useQuery<StoreSectorSnapshot[]>({
    queryKey: ['sectors'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSectors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStoreProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFunds() {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['funds'],
    queryFn: async () => {
      if (!actor) return 0;
      return actor.getFunds();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useGetReputation() {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['reputation'],
    queryFn: async () => {
      if (!actor) return 0;
      return actor.getReputation();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useGetDeliveries() {
  const { actor, isFetching } = useActor();

  return useQuery<Delivery[]>({
    queryKey: ['deliveries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingDeliveries();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000,
  });
}

export function useAddSector() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sectorName: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addSector(sectorName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    },
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      productId: string;
      name: string;
      baseCost: number;
      sellPrice: number;
      sector: string;
      shelfLife: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(
        params.productId,
        params.name,
        params.baseCost,
        params.sellPrice,
        params.sector,
        params.shelfLife
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useOrderStock() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { productId: string; quantity: bigint; supplierName: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.orderStock(params.productId, params.quantity, params.supplierName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funds'] });
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
    },
  });
}

export function useReceiveDeliveries() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.receiveDeliveries();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    },
  });
}
