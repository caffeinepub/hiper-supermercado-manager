import React, { useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useActor } from './hooks/useActor';
import { useGetCallerUserProfile } from './hooks/useQueries';
import TitleScreen from './pages/TitleScreen';
import GameScene from './game/GameScene';
import ProfileSetupDialog from './components/ProfileSetupDialog';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const [gameStarted, setGameStarted] = useState(false);

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  // Show loading screen while initializing
  if (isInitializing || actorFetching) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="flex h-screen items-center justify-center bg-background">
          <div className="text-center">
            <div className="mb-4 text-2xl font-bold text-foreground">HIPER SUPERMERCADO MANAGER</div>
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show profile setup if needed
  if (showProfileSetup) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <ErrorBoundary>
          <ProfileSetupDialog />
        </ErrorBoundary>
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show title screen or game
  if (!gameStarted) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <ErrorBoundary>
          <TitleScreen onStartGame={() => setGameStarted(true)} />
        </ErrorBoundary>
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ErrorBoundary>
        <GameScene />
      </ErrorBoundary>
      <Toaster />
    </ThemeProvider>
  );
}
