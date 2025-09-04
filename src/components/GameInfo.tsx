import React from 'react';
import { Clock, Trophy, Lightbulb, AlertTriangle } from 'lucide-react';
import { Difficulty } from '../types/sudoku';

interface GameInfoProps {
  difficulty: Difficulty;
  elapsedTime: number;
  hintsUsed: number;
  isPlaying: boolean;
  errorCount?: number;
  isGameOver?: boolean;
}

export function GameInfo({ difficulty, elapsedTime, hintsUsed, isPlaying, errorCount = 0, isGameOver = false }: GameInfoProps) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'text-green-400 cyber-text-glow-green';
      case 'normal': return 'text-yellow-400 cyber-text-glow-yellow';
      case 'hard': return 'text-red-400 cyber-text-glow-red';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm md:text-base">
      {/* Difficulty */}
      <div className="flex items-center gap-2">
        <Trophy size={20} className={getDifficultyColor(difficulty)} />
        <span className={`font-semibold capitalize ${getDifficultyColor(difficulty)}`}>
          {difficulty}
        </span>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2">
        <Clock size={20} className={isPlaying ? 'text-cyan-400' : 'text-gray-500'} />
        <span className={`font-mono text-lg ${isPlaying ? 'text-cyan-400 cyber-text-glow-cyan' : 'text-gray-500'}`}>
          {formatTime(elapsedTime)}
        </span>
      </div>

      {/* Hints Used */}
      <div className="flex items-center gap-2">
        <Lightbulb size={20} className="text-yellow-400" />
        <span className="font-semibold text-purple-300">
          Hints: <span className="text-yellow-400 cyber-text-glow-yellow">{hintsUsed}</span>
        </span>
      </div>

      {/* Error Count */}
      <div className="flex items-center gap-2">
        <AlertTriangle size={20} className={errorCount >= 3 ? 'text-red-400' : errorCount >= 2 ? 'text-orange-400' : 'text-gray-500'} />
        <span className="font-semibold text-purple-300">
          Errors: <span className={errorCount >= 3 ? 'text-red-400 cyber-text-glow-red' : errorCount >= 2 ? 'text-orange-400' : 'text-gray-400'}>{errorCount}/3</span>
        </span>
        {isGameOver && <span className="text-red-400 font-bold ml-2 cyber-text-glow-red animate-pulse">SYSTEM ERROR</span>}
      </div>
    </div>
  );
}