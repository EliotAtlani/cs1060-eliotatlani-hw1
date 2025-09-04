import { GameState, GameStats, PuzzleData } from '../types/sudoku';

const GAME_STATE_KEY = 'sudoku-game-state';
const GAME_STATS_KEY = 'sudoku-game-stats';
const PUZZLE_DATA_KEY = 'sudoku-puzzle-data';

export function saveGameState(gameState: GameState): void {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState, (key, value) => {
      if (value instanceof Set) {
        return Array.from(value);
      }
      return value;
    }));
  } catch (error) {
    console.warn('Failed to save game state:', error);
  }
}

export function loadGameState(): GameState | null {
  try {
    const data = localStorage.getItem(GAME_STATE_KEY);
    if (!data) return null;
    
    const gameState = JSON.parse(data, (key, value) => {
      if (key === 'notes' && Array.isArray(value)) {
        return new Set(value);
      }
      return value;
    });
    
    return gameState;
  } catch (error) {
    console.warn('Failed to load game state:', error);
    return null;
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(GAME_STATE_KEY);
    localStorage.removeItem(PUZZLE_DATA_KEY);
  } catch (error) {
    console.warn('Failed to clear game state:', error);
  }
}

export function savePuzzleData(puzzleData: PuzzleData): void {
  try {
    localStorage.setItem(PUZZLE_DATA_KEY, JSON.stringify(puzzleData));
  } catch (error) {
    console.warn('Failed to save puzzle data:', error);
  }
}

export function loadPuzzleData(): PuzzleData | null {
  try {
    const data = localStorage.getItem(PUZZLE_DATA_KEY);
    if (!data) return null;
    
    return JSON.parse(data);
  } catch (error) {
    console.warn('Failed to load puzzle data:', error);
    return null;
  }
}

export function saveGameStats(stats: GameStats): void {
  try {
    localStorage.setItem(GAME_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.warn('Failed to save game stats:', error);
  }
}

export function loadGameStats(): GameStats {
  try {
    const data = localStorage.getItem(GAME_STATS_KEY);
    if (!data) {
      return getDefaultStats();
    }
    
    return JSON.parse(data);
  } catch (error) {
    console.warn('Failed to load game stats:', error);
    return getDefaultStats();
  }
}

function getDefaultStats(): GameStats {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalTime: 0,
    bestTimes: {
      easy: null,
      normal: null,
      hard: null
    }
  };
}