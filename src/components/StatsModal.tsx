import React from 'react';
import { X, Trophy, Clock, Target, Zap } from 'lucide-react';
import { GameStats, Difficulty } from '../types/sudoku';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onReset: () => void;
}

export function StatsModal({ isOpen, onClose, stats, onReset }: StatsModalProps) {
  const formatTime = (ms: number | null) => {
    if (ms === null) return 'N/A';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatAverageTime = () => {
    if (stats.gamesWon === 0) return 'N/A';
    return formatTime(stats.totalTime / stats.gamesWon);
  };

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  const getBestTimeColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600';
      case 'normal': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
    }
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
          <h2 className="text-2xl font-bold text-gray-900">Statistics</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-lg p-1"
            aria-label="Close statistics"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{stats.gamesWon}</div>
              <div className="text-sm text-gray-600">Games Won</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{winRate}%</div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>
          </div>

          {/* Streaks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{stats.currentStreak}</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{stats.bestStreak}</div>
              <div className="text-sm text-gray-600">Best Streak</div>
            </div>
          </div>

          {/* Time Stats */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Time Statistics</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Average Time:</span>
                <span className="font-mono font-semibold">{formatAverageTime()}</span>
              </div>
            </div>
          </div>

          {/* Best Times by Difficulty */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Best Times</h3>
            <div className="space-y-2">
              {(['easy', 'normal', 'hard'] as Difficulty[]).map(difficulty => (
                <div key={difficulty} className="flex justify-between items-center">
                  <span className={`capitalize font-medium ${getBestTimeColor(difficulty)}`}>
                    {difficulty}:
                  </span>
                  <span className="font-mono text-sm">
                    {formatTime(stats.bestTimes[difficulty])}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Games */}
          <div className="text-center text-sm text-gray-600">
            Total games played: {stats.gamesPlayed}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onReset}
              className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg 
                       hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Reset Stats
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}