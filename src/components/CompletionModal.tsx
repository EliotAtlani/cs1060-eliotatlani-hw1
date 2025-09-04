import React, { useEffect } from 'react';
import { Trophy, Clock, Lightbulb, Star } from 'lucide-react';
import { Difficulty } from '../types/sudoku';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  difficulty: Difficulty;
  elapsedTime: number;
  hintsUsed: number;
  isPerfect: boolean;
}

export function CompletionModal({
  isOpen,
  onClose,
  onNewGame,
  difficulty,
  elapsedTime,
  hintsUsed,
  isPerfect
}: CompletionModalProps) {
  useEffect(() => {
    if (isOpen && isPerfect) {
      // Simple confetti effect
      const confetti = document.createElement('div');
      confetti.innerHTML = '🎉🎊✨🎉🎊✨';
      confetti.className = 'fixed inset-0 pointer-events-none z-50 flex items-center justify-center text-6xl';
      confetti.style.animation = 'confetti 3s ease-out forwards';
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        if (document.body.contains(confetti)) {
          document.body.removeChild(confetti);
        }
      }, 3000);
    }
  }, [isOpen, isPerfect]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'text-green-600';
      case 'normal': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
    }
  };

  const getPerformanceMessage = () => {
    if (isPerfect) return "Perfect! No hints used!";
    if (hintsUsed <= 3) return "Excellent work!";
    if (hintsUsed <= 6) return "Good job!";
    return "Puzzle completed!";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
        <div className="mb-6">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Congratulations!
          </h2>
          <p className="text-lg text-gray-600">
            {getPerformanceMessage()}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
          {/* Difficulty */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Difficulty:</span>
            <span className={`font-semibold capitalize ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center gap-2">
              <Clock size={16} />
              Time:
            </span>
            <span className="font-mono text-lg font-semibold text-blue-600">
              {formatTime(elapsedTime)}
            </span>
          </div>

          {/* Hints */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center gap-2">
              <Lightbulb size={16} />
              Hints:
            </span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-yellow-600">
                {hintsUsed}
              </span>
              {isPerfect && <Star className="w-4 h-4 text-yellow-500" />}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Continue
          </button>
          <button
            onClick={onNewGame}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            New Game
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% { transform: scale(0) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: scale(1) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}