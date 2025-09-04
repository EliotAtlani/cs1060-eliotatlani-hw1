import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Difficulty } from '../types/sudoku';

interface NewGameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (difficulty: Difficulty, seed?: string) => void;
}

export function NewGameDialog({ isOpen, onClose, onStartGame }: NewGameDialogProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');
  const [seed, setSeed] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame(selectedDifficulty, seed || undefined);
    onClose();
    setSeed('');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">New Game</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg p-1"
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Difficulty Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'normal', 'hard'] as Difficulty[]).map(difficulty => (
                <button
                  key={difficulty}
                  type="button"
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    selectedDifficulty === difficulty
                      ? difficulty === 'easy'
                        ? 'bg-green-600 text-white focus:ring-green-500'
                        : difficulty === 'normal'
                        ? 'bg-yellow-600 text-white focus:ring-yellow-500'
                        : 'bg-red-600 text-white focus:ring-red-500'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500'
                  }`}
                >
                  {difficulty === 'easy' && '🟢 Easy'}
                  {difficulty === 'normal' && '🟡 Normal'}
                  {difficulty === 'hard' && '🔴 Hard'}
                </button>
              ))}
            </div>
          </div>

          {/* Seed Input */}
          <div>
            <label htmlFor="seed" className="block text-sm font-medium text-gray-700 mb-2">
              Seed (Optional)
            </label>
            <input
              type="text"
              id="seed"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="Enter custom seed for deterministic generation"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Same seed will always generate the same puzzle
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                       hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Start Game
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}