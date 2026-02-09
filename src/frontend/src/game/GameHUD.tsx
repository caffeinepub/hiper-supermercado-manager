import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Play, Pause, Settings, DollarSign, Star, Calendar, Package, Truck, TrendingUp } from 'lucide-react';
import { useGetFunds, useGetReputation } from '../hooks/useQueries';
import SectorsPanel from '../features/sectors/SectorsPanel';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';

interface GameHUDProps {
  simulation: {
    gameState: any;
    isPaused: boolean;
    setIsPaused: (paused: boolean) => void;
    gameSpeed: number;
    setGameSpeed: (speed: number) => void;
  };
}

export default function GameHUD({ simulation }: GameHUDProps) {
  const { data: funds = 0 } = useGetFunds();
  const { data: reputation = 0 } = useGetReputation();
  const [showSectors, setShowSectors] = useState(false);

  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 flex items-start justify-between gap-1 sm:gap-4 pointer-events-none safe-top safe-x z-10">
        <div className="flex flex-wrap gap-1 sm:gap-2 pointer-events-auto">
          <Card className="px-2 sm:px-4 py-1.5 sm:py-2 bg-card/95 backdrop-blur-sm">
            <div className="flex items-center gap-1 sm:gap-2">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              <span className="font-bold text-xs sm:text-sm">${funds.toFixed(2)}</span>
            </div>
          </Card>
          
          <Card className="px-2 sm:px-4 py-1.5 sm:py-2 bg-card/95 backdrop-blur-sm">
            <div className="flex items-center gap-1 sm:gap-2">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
              <span className="font-bold text-xs sm:text-sm">{reputation.toFixed(1)}</span>
            </div>
          </Card>

          <Card className="px-2 sm:px-4 py-1.5 sm:py-2 bg-card/95 backdrop-blur-sm">
            <div className="flex items-center gap-1 sm:gap-2">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              <span className="font-bold text-xs sm:text-sm">Day {Math.floor(simulation.gameState.gameTime / 60)}</span>
            </div>
          </Card>
        </div>

        <div className="flex gap-1 sm:gap-2 pointer-events-auto">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => simulation.setIsPaused(!simulation.isPaused)}
            className="h-9 w-9 sm:h-10 sm:w-10"
          >
            {simulation.isPaused ? <Play className="h-3 w-3 sm:h-4 sm:w-4" /> : <Pause className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
          
          <Card className="px-2 sm:px-3 py-1.5 sm:py-2 bg-card/95 backdrop-blur-sm hidden sm:flex">
            <div className="flex items-center gap-2">
              <span className="text-sm">Speed:</span>
              {[1, 2, 3].map(speed => (
                <Button
                  key={speed}
                  size="sm"
                  variant={simulation.gameSpeed === speed ? 'default' : 'ghost'}
                  onClick={() => simulation.setGameSpeed(speed)}
                  className="h-6 w-6 p-0"
                >
                  {speed}x
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom HUD */}
      <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex justify-center pointer-events-none safe-bottom safe-x z-10">
        <div className="flex flex-wrap gap-1.5 sm:gap-2 pointer-events-auto justify-center">
          <Sheet open={showSectors} onOpenChange={setShowSectors}>
            <SheetTrigger asChild>
              <Button variant="secondary" size="default" className="min-h-[44px] text-xs sm:text-sm px-3 sm:px-4">
                <Package className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Sectors</span>
                <span className="xs:hidden">Sec</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-4 sm:p-6">
              <SectorsPanel />
            </SheetContent>
          </Sheet>

          <Button variant="secondary" size="default" className="min-h-[44px] text-xs sm:text-sm px-3 sm:px-4">
            <Truck className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Logistics</span>
            <span className="xs:hidden">Log</span>
          </Button>

          <Button variant="secondary" size="default" className="min-h-[44px] text-xs sm:text-sm px-3 sm:px-4">
            <TrendingUp className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Finance</span>
            <span className="xs:hidden">Fin</span>
          </Button>

          <Button variant="secondary" size="default" className="min-h-[44px] text-xs sm:text-sm px-3 sm:px-4">
            <Settings className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Set</span>
          </Button>
        </div>
      </div>

      {/* Game Stats Overlay - Hidden on small screens */}
      <div className="absolute top-20 sm:top-24 left-2 sm:left-4 pointer-events-none hidden md:block safe-left">
        <Card className="px-3 py-2 bg-card/80 backdrop-blur-sm text-xs space-y-1">
          <div>Customers: {simulation.gameState.customers.length}</div>
          <div>Cleanliness: {simulation.gameState.cleanliness}%</div>
          <div>Tick: {simulation.gameState.tick}</div>
        </Card>
      </div>
    </>
  );
}
