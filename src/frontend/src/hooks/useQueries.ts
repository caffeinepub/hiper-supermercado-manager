import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';

// Define types for store data since backend doesn't export them yet
export interface StockItem {
  productId: string;
  quantity: bigint;
  purchasePrice: number;
  sellingPrice: number;
  expirationTime: bigint;
}

export interface StoreSectorSnapshot {
  name: string;
  stock: StockItem[];
  cleanliness: bigint;
  staffAssigned: bigint;
  qualityLevel: bigint;
}

export interface Product {
  id: string;
  name: string;
  baseCost: number;
  sellPrice: number;
  sector: string;
  shelfLife: bigint;
}

export interface Delivery {
  productId: string;
  quantity: bigint;
  arrivalTime: bigint;
  supplierName: string;
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerUserProfile();
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
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
      try {
        return await actor.saveCallerUserProfile(profile);
      } catch (error) {
        console.error('Error saving user profile:', error);
        throw error;
      }
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
      try {
        return await actor.createStore();
      } catch (error) {
        console.error('Error creating store:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store'] });
    },
  });
}

// Mock data for sectors until backend implements these methods
export function useGetSectors() {
  const { actor, isFetching } = useActor();

  return useQuery<StoreSectorSnapshot[]>({
    queryKey: ['sectors'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend doesn't have getSectors yet, return empty array
      console.warn('getSectors not implemented in backend');
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

// Mock data for products until backend implements these methods
export function useGetProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend doesn't have getStoreProducts yet, return empty array
      console.warn('getStoreProducts not implemented in backend');
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFunds() {
  const { actor, isFetching } = useActor();

  return useQuery<number>({
    queryKey: ['funds'],
    queryFn: async () => {
      if (!actor) return 10000;
      // Backend doesn't have getFunds yet, return default
      console.warn('getFunds not implemented in backend');
      return 10000;
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
      if (!actor) return 3.0;
      // Backend doesn't have getReputation yet, return default
      console.warn('getReputation not implemented in backend');
      return 3.0;
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
      // Backend doesn't have getPendingDeliveries yet, return empty array
      console.warn('getPendingDeliveries not implemented in backend');
      return [];
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
      // Backend doesn't have addSector yet
      console.warn('addSector not implemented in backend, skipping:', sectorName);
      return Promise.resolve();
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
      // Backend doesn't have addProduct yet
      console.warn('addProduct not implemented in backend, skipping:', params.name);
      return Promise.resolve();
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
      // Backend doesn't have orderStock yet
      console.warn('orderStock not implemented in backend');
      return Promise.resolve();
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
      // Backend doesn't have receiveDeliveries yet
      console.warn('receiveDeliveries not implemented in backend');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] });
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    },
  });
}
