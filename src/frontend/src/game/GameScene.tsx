import React, { useState, useEffect } from 'react';
import GameCanvas from './render/GameCanvas';
import GameHUD from './GameHUD';
import { useGameSimulation } from './sim/useGameSimulation';
import StoreInitializer from '../components/StoreInitializer';
import { useGetSectors } from '../hooks/useQueries';

export default function GameScene() {
  const { data: sectors, isLoading } = useGetSectors();
  const [storeInitialized, setStoreInitialized] = useState(false);
  const simulation = useGameSimulation();

  useEffect(() => {
    if (sectors && sectors.length > 0) {
      setStoreInitialized(true);
    }
  }, [sectors]);

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading game...</div>
      </div>
    );
  }

  if (!storeInitialized) {
    return <StoreInitializer onInitialized={() => setStoreInitialized(true)} />;
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-background flex flex-col">
      <div className="flex-1 relative">
        <GameCanvas simulation={simulation} />
        <GameHUD simulation={simulation} />
      </div>
    </div>
  );
}
