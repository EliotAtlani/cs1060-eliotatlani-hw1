import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Lightbulb, 
  Edit3, 
  Plus,
  SkipForward,
  FastForward
} from 'lucide-react';

interface GameControlsProps {
  isPlaying: boolean;
  isNotesMode: boolean;
  canUndo: boolean;
  canRedo: boolean;
  canResume: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNewGame: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleNotes: () => void;
  onHint: () => void;
  onPlayStep: () => void;
  onSolvePuzzle: () => void;
}

export function GameControls({
  isPlaying,
  isNotesMode,
  canUndo,
  canRedo,
  canResume,
  onPlay,
  onPause,
  onNewGame,
  onUndo,
  onRedo,
  onToggleNotes,
  onHint,
  onPlayStep,
  onSolvePuzzle
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {/* Play/Pause */}
      <button
        onClick={isPlaying ? onPause : onPlay}
        disabled={!canResume && !isPlaying}
        className="cyber-control-button flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-700 
                   text-white rounded-lg hover:from-cyan-500 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 
                   disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500
                   transform hover:scale-105 active:scale-95"
        style={{
          boxShadow: !(!canResume && !isPlaying) 
            ? '0 0 15px rgba(6, 182, 212, 0.4), inset 0 0 15px rgba(6, 182, 212, 0.1)' 
            : '0 0 5px rgba(75, 85, 99, 0.3)'
        }}
        aria-label={isPlaying ? 'Pause game' : 'Resume game'}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        <span className="cyber-text-glow-cyan">{isPlaying ? 'PAUSE' : 'RESUME'}</span>
      </button>

      {/* New Game */}
      <button
        onClick={onNewGame}
        className="cyber-control-button flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 
                   text-white rounded-lg hover:from-green-500 hover:to-emerald-600 transition-all duration-300 
                   focus:outline-none focus:ring-2 focus:ring-green-500 transform hover:scale-105 active:scale-95"
        style={{
          boxShadow: '0 0 15px rgba(16, 185, 129, 0.4), inset 0 0 15px rgba(16, 185, 129, 0.1)'
        }}
        aria-label="Start new game"
      >
        <Plus size={18} />
        <span className="cyber-text-glow-green">NEW GAME</span>
      </button>

      {/* Undo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="cyber-control-button flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-violet-700 
                   text-white rounded-lg hover:from-purple-500 hover:to-violet-600 disabled:from-gray-600 disabled:to-gray-700 
                   disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500
                   transform hover:scale-105 active:scale-95"
        style={{
          boxShadow: canUndo 
            ? '0 0 15px rgba(147, 51, 234, 0.4), inset 0 0 15px rgba(147, 51, 234, 0.1)' 
            : '0 0 5px rgba(75, 85, 99, 0.3)'
        }}
        aria-label="Undo last move"
        title="Ctrl+Z"
      >
        <RotateCcw size={18} />
        <span className={canUndo ? "cyber-text-glow-purple" : ""}>UNDO</span>
      </button>

      {/* Redo */}
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="cyber-control-button flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-violet-700 
                   text-white rounded-lg hover:from-purple-500 hover:to-violet-600 disabled:from-gray-600 disabled:to-gray-700 
                   disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500
                   transform hover:scale-105 active:scale-95"
        style={{
          boxShadow: canRedo 
            ? '0 0 15px rgba(147, 51, 234, 0.4), inset 0 0 15px rgba(147, 51, 234, 0.1)' 
            : '0 0 5px rgba(75, 85, 99, 0.3)'
        }}
        aria-label="Redo last undone move"
        title="Ctrl+Y"
      >
        <RotateCw size={18} />
        <span className={canRedo ? "cyber-text-glow-purple" : ""}>REDO</span>
      </button>

      {/* Toggle Notes */}
      <button
        onClick={onToggleNotes}
        className={`cyber-control-button flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 
                   focus:outline-none focus:ring-2 focus:ring-orange-500 transform hover:scale-105 active:scale-95 ${
          isNotesMode 
            ? 'bg-gradient-to-r from-orange-600 to-amber-700 text-white hover:from-orange-500 hover:to-amber-600' 
            : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 hover:from-gray-500 hover:to-gray-600'
        }`}
        style={{
          boxShadow: isNotesMode
            ? '0 0 15px rgba(251, 146, 60, 0.4), inset 0 0 15px rgba(251, 146, 60, 0.1)'
            : '0 0 10px rgba(75, 85, 99, 0.3), inset 0 0 10px rgba(75, 85, 99, 0.1)'
        }}
        aria-label={`${isNotesMode ? 'Disable' : 'Enable'} notes mode`}
        title="Space"
      >
        <Edit3 size={18} />
        <span className={isNotesMode ? "cyber-text-glow-yellow" : ""}>NOTES</span>
      </button>

      {/* Hint */}
      <button
        onClick={onHint}
        className="cyber-control-button flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 
                   text-white rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 
                   focus:outline-none focus:ring-2 focus:ring-yellow-500 transform hover:scale-105 active:scale-95"
        style={{
          boxShadow: '0 0 15px rgba(251, 191, 36, 0.4), inset 0 0 15px rgba(251, 191, 36, 0.1)'
        }}
        aria-label="Get hint"
        title="Ctrl+H"
      >
        <Lightbulb size={18} />
        <span className="cyber-text-glow-yellow">HINT</span>
      </button>

      {/* Play Next Step */}
      <button
        onClick={onPlayStep}
        className="cyber-control-button flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 
                   text-white rounded-lg hover:from-indigo-500 hover:to-purple-600 transition-all duration-300 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 transform hover:scale-105 active:scale-95"
        style={{
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.4), inset 0 0 15px rgba(99, 102, 241, 0.1)'
        }}
        aria-label="Play next step"
      >
        <SkipForward size={18} />
        <span className="cyber-text-glow-purple">STEP</span>
      </button>

      {/* Solve Puzzle */}
      <button
        onClick={onSolvePuzzle}
        className="cyber-control-button flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600 to-rose-700 
                   text-white rounded-lg hover:from-red-500 hover:to-rose-600 transition-all duration-300 
                   focus:outline-none focus:ring-2 focus:ring-red-500 transform hover:scale-105 active:scale-95"
        style={{
          boxShadow: '0 0 15px rgba(239, 68, 68, 0.4), inset 0 0 15px rgba(239, 68, 68, 0.1)'
        }}
        aria-label="Solve entire puzzle"
      >
        <FastForward size={18} />
        <span className="cyber-text-glow-red">SOLVE ALL</span>
      </button>
    </div>
  );
}