import React from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import LoginButton from '../components/LoginButton';
import AboutDialog from '../features/about/AboutDialog';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';

interface TitleScreenProps {
  onStartGame: () => void;
}

export default function TitleScreen({ onStartGame }: TitleScreenProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const handleStartGame = () => {
    if (!isAuthenticated) {
      toast.error('Please login first to start the game');
      return;
    }
    onStartGame();
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center bg-gradient-to-br from-background via-accent/10 to-background safe-x safe-y px-4">
      <div className="absolute inset-0 bg-[url('/assets/generated/hsm-tileset.dim_2048x2048.png')] opacity-5 bg-repeat" />
      
      <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-8 w-full max-w-3xl">
        <img
          src="/assets/generated/hsm-title-logo.dim_2048x1024.png"
          alt="HIPER SUPERMERCADO MANAGER"
          className="w-full max-w-[min(90vw,48rem)] drop-shadow-2xl"
        />
        
        <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm p-4 sm:p-8">
          <div className="flex flex-col gap-3 sm:gap-4">
            <Button
              size="lg"
              className="w-full text-base sm:text-lg font-bold min-h-[44px]"
              onClick={handleStartGame}
              disabled={!isAuthenticated}
            >
              {isAuthenticated ? 'Start Game' : 'Login to Start'}
            </Button>
            
            <LoginButton />
            
            <AboutDialog />
          </div>
        </Card>

        <div className="text-center text-xs sm:text-sm text-muted-foreground px-4">
          <p>© {new Date().getFullYear()} ITA Games Studios – All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
