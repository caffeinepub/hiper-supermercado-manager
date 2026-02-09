import React, { useEffect, useState } from 'react';
import { useCreateStore, useAddSector, useAddProduct } from '../hooks/useQueries';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { toast } from 'sonner';
import { SECTOR_DEFINITIONS } from '../features/sectors/sectorConstants';
import { INITIAL_PRODUCTS } from '../game/data/initialProducts';

interface StoreInitializerProps {
  onInitialized: () => void;
}

export default function StoreInitializer({ onInitialized }: StoreInitializerProps) {
  const createStore = useCreateStore();
  const addSector = useAddSector();
  const addProduct = useAddProduct();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing store...');

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        setStatus('Creating store...');
        setProgress(10);
        await createStore.mutateAsync();

        const totalSteps = SECTOR_DEFINITIONS.length + INITIAL_PRODUCTS.length;
        let currentStep = 0;

        setStatus('Adding sectors...');
        for (const sector of SECTOR_DEFINITIONS) {
          if (!mounted) return;
          await addSector.mutateAsync(sector.name);
          currentStep++;
          setProgress(10 + (currentStep / totalSteps) * 80);
        }

        setStatus('Adding products...');
        for (const product of INITIAL_PRODUCTS) {
          if (!mounted) return;
          await addProduct.mutateAsync(product);
          currentStep++;
          setProgress(10 + (currentStep / totalSteps) * 80);
        }

        setProgress(100);
        setStatus('Store ready!');
        
        if (mounted) {
          setTimeout(() => {
            onInitialized();
          }, 500);
        }
      } catch (error) {
        console.error('Store initialization error:', error);
        toast.error('Failed to initialize store');
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4 safe-x safe-y">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-center">Setting Up Your Store</h2>
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-xs sm:text-sm text-center text-muted-foreground">{status}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
