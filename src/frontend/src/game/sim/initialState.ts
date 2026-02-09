import { GameState } from './types';

export function createInitialGameState(): GameState {
  return {
    tick: 0,
    gameTime: 0,
    customers: [],
    employees: [],
    cleanliness: 100,
    reputation: 3.0,
  };
}
