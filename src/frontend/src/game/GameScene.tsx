import React, { useState, useEffect } from 'react';
import GameCanvas from './render/GameCanvas';
import GameHUD from './GameHUD';
import { useGameSimulation } from './sim/useGameSimulation';
import StoreInitializer from '../components/StoreInitializer';
import { useGetSectors } from '../hooks/useQueries';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function GameScene() {
  const { data: sectors, isLoading, error } = useGetSectors();
  const [storeInitialized, setStoreInitialized] = useState(false);
  const simulation = useGameSimulation();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (!storeInitialized) {
          console.log('Proceeding to store initialization');
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, storeInitialized]);

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading game...</div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading sectors:', error);
  }

  if (!storeInitialized) {
    return (
      <ErrorBoundary>
        <StoreInitializer onInitialized={() => setStoreInitialized(true)} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="relative h-[100dvh] w-full overflow-hidden bg-background flex flex-col">
        <div className="flex-1 relative">
          <GameCanvas simulation={simulation} />
          <GameHUD simulation={simulation} />
        </div>
      </div>
    </ErrorBoundary>
  );
}
