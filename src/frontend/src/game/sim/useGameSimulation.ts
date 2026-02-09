import { useState, useEffect, useRef } from 'react';
import { GameState, Customer, Employee } from './types';
import { createInitialGameState } from './initialState';

export function useGameSimulation() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [isPaused, setIsPaused] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTickRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isPaused) return;

    const tick = () => {
      const now = Date.now();
      const delta = now - lastTickRef.current;
      const tickInterval = 1000 / gameSpeed;

      if (delta >= tickInterval) {
        lastTickRef.current = now;
        
        setGameState(prevState => {
          const newState = { ...prevState };
          newState.tick += 1;
          newState.gameTime += 1;

          // Update customers
          newState.customers = newState.customers.map(customer => ({
            ...customer,
            x: customer.x + (Math.random() - 0.5) * 2,
            y: customer.y + (Math.random() - 0.5) * 2,
          }));

          // Spawn new customers periodically
          if (newState.tick % 60 === 0 && newState.customers.length < 20) {
            const newCustomer: Customer = {
              id: `customer_${newState.tick}`,
              x: 50,
              y: 50,
              type: ['Economic', 'Demanding', 'Impulsive', 'Loyal', 'Wholesaler'][Math.floor(Math.random() * 5)] as any,
              satisfaction: 3,
              inQueue: false,
            };
            newState.customers.push(newCustomer);
          }

          return newState;
        });
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, gameSpeed]);

  return {
    gameState,
    isPaused,
    setIsPaused,
    gameSpeed,
    setGameSpeed,
  };
}
