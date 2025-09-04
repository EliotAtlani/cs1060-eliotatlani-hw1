import React, { useState, useCallback } from 'react';
import { BarChart3, Plus } from 'lucide-react';
import { useGame } from './hooks/useGame';
import { useKeyboard } from './hooks/useKeyboard';
import { SudokuBoard } from './components/SudokuBoard';
import { GameControls } from './components/GameControls';
import { NumberPad } from './components/NumberPad';
import { GameInfo } from './components/GameInfo';
import { NewGameDialog } from './components/NewGameDialog';
import { StatsModal } from './components/StatsModal';
import { HintDisplay } from './components/HintDisplay';
import { CompletionModal } from './components/CompletionModal';
import { SolverStep } from './types/sudoku';

function App() {
  const {
    gameState,
    puzzleData,
    stats,
    isPlaying,
    newGame,
    resumeGame,
    pauseGame,
    selectCell,
    toggleNotesMode,
    makeMove,
    undo,
    redo,
    getHint,
    playNextStep,
    solvePuzzle,
    resetGame,
    resetStats,
    canUndo,
    canRedo
  } = useGame();

  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [currentHint, setCurrentHint] = useState<SolverStep | null>(null);
  const [highlightedCells, setHighlightedCells] = useState<Array<{row: number; col: number}>>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Handle game completion
  React.useEffect(() => {
    if (gameState?.isComplete && !showCompletionModal) {
      setShowCompletionModal(true);
    }
  }, [gameState?.isComplete, showCompletionModal]);

  const handleNewGame = useCallback(() => {
    setShowNewGameDialog(true);
  }, []);

  const handleCellClick = useCallback((position: { row: number; col: number }) => {
    if (!isPlaying || gameState?.isGameOver) return;
    selectCell(position);
    
    // Highlight cells with the same number
    if (gameState) {
      const clickedCell = gameState.board[position.row][position.col];
      if (clickedCell.value !== null) {
        const sameNumberCells: Array<{row: number; col: number}> = [];
        gameState.board.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            if (cell.value === clickedCell.value) {
              sameNumberCells.push({ row: rowIndex, col: colIndex });
            }
          });
        });
        setHighlightedCells(sameNumberCells);
      } else {
        setHighlightedCells([]);
      }
    }
  }, [selectCell, isPlaying, gameState]);

  const handleNumberInput = useCallback((num: number) => {
    if (!isPlaying || gameState?.isGameOver) return;
    if (gameState?.selectedCell) {
      makeMove(gameState.selectedCell, num, gameState.isNotesMode);
    }
  }, [gameState?.selectedCell, gameState?.isNotesMode, makeMove, isPlaying, gameState?.isGameOver]);

  const handleDelete = useCallback(() => {
    if (!isPlaying || gameState?.isGameOver) return;
    if (gameState?.selectedCell) {
      makeMove(gameState.selectedCell, null, false);
    }
  }, [gameState?.selectedCell, makeMove, isPlaying, gameState?.isGameOver]);

  const handleHint = useCallback(() => {
    const hint = getHint();
    if (hint) {
      setCurrentHint(hint);
      // Highlight related cells
      if (hint.cells) {
        setHighlightedCells(hint.cells);
        setTimeout(() => setHighlightedCells([]), 3000);
      }
    }
  }, [getHint]);

  const handlePlayStep = useCallback(() => {
    const step = playNextStep();
    if (step) {
      // Show the step as a hint
      setCurrentHint(step);
      if (step.cells) {
        setHighlightedCells(step.cells);
        setTimeout(() => setHighlightedCells([]), 2000);
      }
    }
  }, [playNextStep]);

  const handleSolvePuzzle = useCallback(() => {
    const steps = solvePuzzle();
    if (steps.length > 0) {
      // Show summary of techniques used
      const techniques = [...new Set(steps.map(step => step.technique))];
      setCurrentHint({
        technique: 'Puzzle Solved',
        description: `Used techniques: ${techniques.join(', ')}`,
        cells: [],
        values: []
      });
    }
  }, [solvePuzzle]);

  useKeyboard({
    selectedCell: gameState?.selectedCell || null,
    onSelectCell: selectCell,
    onNumberInput: handleNumberInput,
    onDelete: handleDelete,
    onNewGame: handleNewGame,
    onUndo: undo,
    onRedo: redo,
    onToggleNotes: toggleNotesMode,
    onHint: handleHint,
    canUndo,
    canRedo,
    isGameActive: !!gameState && !gameState.isComplete
  });

  // Handle click outside to deselect cell
  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectCell(null);
      setHighlightedCells([]);
    }
  }, [selectCell]);

  const hasGame = !!gameState && !!puzzleData;
  const canResume = hasGame && !gameState.isComplete;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4"
      onClick={handleBackgroundClick}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 relative">
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-7xl font-black tracking-wider mb-4 relative title-neon">
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-blue-300 to-purple-300 blur-sm opacity-70">
                SUDOKU NEXUS
              </span>
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                SUDOKU NEXUS
              </span>
            </h1>
            {/* Animated circuit lines */}
            <div className="absolute -inset-4 opacity-30">
              <div className="absolute top-0 left-1/4 w-1 h-8 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse"></div>
              <div className="absolute bottom-0 right-1/3 w-1 h-6 bg-gradient-to-t from-transparent via-purple-400 to-transparent animate-pulse delay-500"></div>
              <div className="absolute top-1/2 left-0 w-12 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse delay-1000"></div>
              <div className="absolute top-1/3 right-0 w-8 h-px bg-gradient-to-l from-transparent via-blue-400 to-transparent animate-pulse delay-700"></div>
            </div>
          </div>
          <p className="text-cyan-300 text-xl font-light tracking-wide subtitle-glow">
            Enter the digital matrix of logical challenges
          </p>
          <div className="flex items-center justify-center mt-4 space-x-2 text-cyan-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-mono tracking-wider opacity-80">NEURAL NETWORK ACTIVE</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse delay-300"></div>
          </div>
        </header>

        {/* Game Info */}
        {hasGame && (
          <div className="mb-6">
            <GameInfo
              difficulty={puzzleData.difficulty}
              elapsedTime={gameState.elapsedTime}
              hintsUsed={gameState.hintsUsed}
              isPlaying={isPlaying}
              errorCount={gameState.errorCount}
              isGameOver={gameState.isGameOver}
            />
          </div>
        )}

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Game Board */}
          <div className="lg:col-span-2">
            {hasGame ? (
              <SudokuBoard
                board={gameState.board}
                selectedCell={gameState.selectedCell}
                onCellClick={handleCellClick}
                highlightedCells={highlightedCells}
                className="mx-auto max-w-lg lg:max-w-none"
              />
            ) : (
              <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border-2 border-cyan-500 rounded-xl 
                              shadow-2xl p-10 text-center max-w-lg mx-auto cyber-glow relative overflow-hidden">
                {/* Animated background grid */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-8 grid-rows-8 h-full">
                    {Array.from({length: 64}).map((_, i) => (
                      <div key={i} className={`border border-cyan-400 ${i % 9 === 0 ? 'animate-pulse' : ''}`} 
                           style={{animationDelay: `${i * 100}ms`}} />
                    ))}
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-green-400 
                                    flex items-center justify-center cyber-pulse">
                      <Plus size={32} className="text-gray-900 font-bold" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-2">
                    INITIALIZE NEXUS
                  </h2>
                  <p className="text-cyan-300 mb-8 text-lg leading-relaxed">
                    Launch neural puzzle matrix to begin<br/>
                    <span className="text-green-400 font-semibold">cognitive enhancement protocol</span>
                  </p>
                  <button
                    onClick={handleNewGame}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 
                               text-gray-900 rounded-xl hover:from-green-400 hover:via-cyan-400 hover:to-blue-400 
                               focus:outline-none focus:ring-2 focus:ring-cyan-400 font-bold text-lg
                               transition-all duration-300 transform hover:scale-105 active:scale-95 cyber-init-button
                               shadow-lg"
                  >
                    <Plus size={24} />
                    <span>INITIATE MATRIX</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Number Pad */}
            {hasGame && (
              <div className="bg-gray-800 border border-green-500 rounded-lg shadow-2xl p-4 cyber-glow">
                <h3 className="font-semibold text-green-400 mb-4 text-center">
                  INPUT MATRIX
                </h3>
                <NumberPad
                  onNumberSelect={handleNumberInput}
                  onErase={handleDelete}
                  isNotesMode={gameState.isNotesMode}
                />
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-gray-800 border border-cyan-500 rounded-lg shadow-2xl p-4 cyber-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-cyan-400">NEURAL METRICS</h3>
                <button
                  onClick={() => setShowStatsModal(true)}
                  className="text-cyan-400 hover:text-cyan-300 focus:outline-none 
                           focus:ring-2 focus:ring-cyan-500 rounded p-1 transition-colors"
                  aria-label="View detailed statistics"
                >
                  <BarChart3 size={20} />
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-300">Games Won:</span>
                  <span className="font-semibold text-cyan-400">{stats.gamesWon}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300">Win Rate:</span>
                  <span className="font-semibold text-cyan-400">
                    {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300">Current Streak:</span>
                  <span className="font-semibold text-cyan-400">{stats.currentStreak}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Controls */}
        {hasGame && (
          <div className="bg-gray-800 border border-purple-500 rounded-lg shadow-2xl p-4 mb-6 cyber-glow">
            <GameControls
              isPlaying={isPlaying}
              isNotesMode={gameState.isNotesMode}
              canUndo={canUndo}
              canRedo={canRedo}
              canResume={canResume}
              onPlay={resumeGame}
              onPause={pauseGame}
              onNewGame={handleNewGame}
              onUndo={undo}
              onRedo={redo}
              onToggleNotes={toggleNotesMode}
              onHint={handleHint}
              onPlayStep={handlePlayStep}
              onSolvePuzzle={handleSolvePuzzle}
            />
          </div>
        )}

        {/* Keyboard Shortcuts */}
        <div className="bg-gray-800 border border-purple-500 rounded-lg shadow-2xl p-4 cyber-glow">
          <h3 className="font-semibold text-purple-400 mb-3">COMMAND INTERFACE</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div className="text-green-300"><kbd className="kbd">1-9</kbd> Enter number</div>
            <div className="text-green-300"><kbd className="kbd">Space</kbd> Toggle notes</div>
            <div className="text-green-300"><kbd className="kbd">Backspace</kbd> Clear cell</div>
            <div className="text-green-300"><kbd className="kbd">Arrow keys</kbd> Navigate</div>
            <div className="text-green-300"><kbd className="kbd">Ctrl+Z</kbd> Undo</div>
            <div className="text-green-300"><kbd className="kbd">Ctrl+Y</kbd> Redo</div>
            <div className="text-green-300"><kbd className="kbd">Ctrl+N</kbd> New game</div>
            <div className="text-green-300"><kbd className="kbd">Ctrl+H</kbd> Hint</div>
            <div className="text-green-300"><kbd className="kbd">Escape</kbd> Deselect</div>
          </div>
        </div>
      </div>

      {/* Modals and Overlays */}
      <NewGameDialog
        isOpen={showNewGameDialog}
        onClose={() => setShowNewGameDialog(false)}
        onStartGame={(difficulty, seed) => {
          newGame(difficulty, seed);
          setShowCompletionModal(false);
        }}
      />

      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        stats={stats}
        onReset={resetStats}
      />

      <HintDisplay
        hint={currentHint}
        onClose={() => setCurrentHint(null)}
      />

      {hasGame && (
        <CompletionModal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          onNewGame={handleNewGame}
          difficulty={puzzleData.difficulty}
          elapsedTime={gameState.elapsedTime}
          hintsUsed={gameState.hintsUsed}
          isPerfect={gameState.hintsUsed === 0}
        />
      )}

      {/* Global Styles */}
      <style>{`
        .kbd {
          padding: 0.25rem 0.5rem;
          background: linear-gradient(145deg, #1f2937, #374151);
          color: #10b981;
          border: 1px solid #059669;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas;
          box-shadow: 0 0 5px rgba(16, 185, 129, 0.3);
        }
        .sudoku-board {
          aspect-ratio: 1;
        }
        .title-neon {
          filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.8))
                  drop-shadow(0 0 40px rgba(147, 51, 234, 0.6))
                  drop-shadow(0 0 60px rgba(16, 185, 129, 0.4));
        }
        .subtitle-glow {
          text-shadow: 0 0 10px rgba(6, 182, 212, 0.6);
        }
        .cyber-glow {
          box-shadow: 
            0 0 10px rgba(6, 182, 212, 0.3),
            0 0 20px rgba(6, 182, 212, 0.1),
            inset 0 0 10px rgba(6, 182, 212, 0.1);
        }
        .cyber-button {
          text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
          box-shadow: 
            0 0 10px rgba(16, 185, 129, 0.5),
            0 0 20px rgba(6, 182, 212, 0.3);
        }
        .cyber-button:hover {
          box-shadow: 
            0 0 15px rgba(16, 185, 129, 0.7),
            0 0 30px rgba(6, 182, 212, 0.5);
        }
        .cyber-text-glow-red {
          text-shadow: 0 0 10px #ef4444, 0 0 20px #ef4444;
        }
        .cyber-text-glow-cyan {
          text-shadow: 0 0 10px #06b6d4, 0 0 20px #06b6d4;
        }
        .cyber-text-glow-green {
          text-shadow: 0 0 10px #10b981, 0 0 20px #10b981;
        }
        .cyber-text-glow-purple {
          text-shadow: 0 0 5px #a855f7, 0 0 10px #a855f7;
        }
        .cyber-text-glow-yellow {
          text-shadow: 0 0 10px #fbbf24, 0 0 20px #fbbf24;
        }
        
        .cyber-pulse {
          animation: cyber-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes cyber-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.6);
            transform: scale(1.05);
          }
        }
        
        .cyber-init-button {
          position: relative;
          overflow: hidden;
        }
        
        .cyber-init-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        
        .cyber-init-button:hover::before {
          left: 100%;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #1f2937;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #10b981, #06b6d4);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #059669, #0891b2);
        }
      `}</style>
    </div>
  );
}

export default App;