# Sudoku Master 🧩

A comprehensive, feature-rich Sudoku game built with React and TypeScript, featuring advanced puzzle generation algorithms, sophisticated solving techniques, and a beautiful, responsive user interface.

## 🚀 Features

### Core Gameplay
- **9x9 Sudoku Board** with intuitive cell selection and visual feedback
- **Three Difficulty Levels**: Easy, Normal, and Hard with different solving complexity
- **Notes System**: Toggle between number entry and note-taking modes
- **Undo/Redo**: Complete move history with unlimited undo/redo functionality
- **Conflict Detection**: Real-time highlighting of invalid moves
- **Timer**: Accurate game timing with pause/resume functionality

### Advanced Solving Engine
- **7+ Solving Techniques** implemented:
  - Single Candidate (naked singles)
  - Hidden Single
  - Naked Pairs/Triples
  - Pointing Pairs
  - Box-Line Reduction
  - X-Wing patterns
  - Depth-limited Backtracking
- **Human-like Solver**: Solves puzzles step by step using logical techniques
- **Hint System**: Get strategic hints with explanations of techniques
- **Computer Play**: "Play For Me" and "Solve Puzzle" with animated moves

### Puzzle Generation
- **Deterministic Generation**: Seeded random generation for reproducible puzzles
- **Unique Solutions**: Guarantees puzzles have exactly one valid solution
- **Difficulty Scaling**: Algorithmic difficulty adjustment based on required techniques
- **Custom Seeds**: Generate specific puzzles with seed input

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Keyboard Navigation**: Full keyboard support with intuitive shortcuts
- **Accessibility**: ARIA labels, screen reader support, and keyboard-first design
- **Persistent Storage**: Auto-save game progress and statistics
- **Visual Feedback**: Smooth animations and micro-interactions

### Statistics & Progress
- **Comprehensive Stats**: Games played/won, win rate, streaks, best times
- **Performance Tracking**: Track hints used, perfect games, and improvement over time
- **Difficulty-based Records**: Separate best times for each difficulty level

## 🎮 Keyboard Shortcuts

| Shortcut | Action |
|----------|---------|
| `1-9` | Enter number in selected cell |
| `Arrow Keys` | Navigate between cells |
| `Space` | Toggle notes mode |
| `Backspace/Delete` | Clear selected cell |
| `Escape` | Deselect cell |
| `Ctrl+Z` | Undo last move |
| `Ctrl+Y` | Redo undone move |
| `Ctrl+N` | Start new game |
| `Ctrl+H` | Get hint |

## 🏗️ Technical Architecture

### Core Technologies
- **React 18** with hooks and functional components
- **TypeScript** for type safety and better development experience
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **Lucide React** for consistent iconography

### Key Components
- **Game Engine** (`src/utils/`): Core Sudoku logic, puzzle generation, and solving
- **React Components** (`src/components/`): Modular UI components
- **Custom Hooks** (`src/hooks/`): Reusable game logic and keyboard handling
- **Persistence Layer** (`src/utils/game-persistence.ts`): Local storage management

### Algorithm Highlights
- **Seeded Random Generator**: Ensures deterministic puzzle generation
- **Advanced Solver**: Implements sophisticated techniques like X-Wing and naked triples
- **Conflict Detection**: Real-time validation with efficient constraint checking
- **Move History**: Complete game state management with branching undo/redo

## 🧪 Testing

The project includes comprehensive tests covering:
- **Core Sudoku Logic**: Board validation, constraint checking, utilities
- **Puzzle Generation**: Uniqueness verification, difficulty scaling, seed consistency  
- **Solver Algorithms**: Technique correctness, step-by-step solving, edge cases

Run tests with:
```bash
npm test          # Run all tests
npm run test:ui   # Run tests with UI
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sudoku-master
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm test           # Run tests
npm run test:ui    # Run tests with UI
```

## 🎯 Gameplay Tips

### For Beginners
1. Start with **Easy** difficulty to learn the basics
2. Use **Notes mode** (Space key) to track possible numbers
3. Look for cells with only one possible number (**Single Candidate**)
4. Check each row, column, and 3x3 box for missing numbers (**Hidden Single**)

### Advanced Techniques  
1. **Naked Pairs**: When two cells in the same unit can only contain the same two numbers
2. **Pointing Pairs**: When a number in a box is restricted to one row/column
3. **Box-Line Reduction**: When a number in a row/column is restricted to one box
4. **X-Wing**: Advanced pattern involving four cells forming a rectangle

### Using Hints Effectively
- Use hints sparingly to maintain challenge
- Read hint explanations to learn new techniques
- Practice identified techniques in future games
- Try to solve without hints for perfect games

## 🎨 Design Philosophy

### Visual Design
- **Clean, Modern Interface**: Minimal design focused on gameplay
- **Consistent Color System**: Semantic colors for different game states
- **Responsive Grid**: Adapts beautifully to any screen size
- **Smooth Animations**: Subtle feedback without distraction

### User Experience
- **Progressive Disclosure**: Complex features revealed as needed
- **Accessibility First**: Works great with keyboard and screen readers
- **Performance Optimized**: Fast rendering and responsive interactions
- **Mobile-Friendly**: Touch-optimized for mobile devices

## 🤝 Contributing

We welcome contributions! Here's how to help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper tests
4. **Run tests**: `npm test`
5. **Submit a pull request**

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Maintain responsive design principles
- Follow existing code style and patterns

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Sudoku puzzle generation algorithms inspired by academic research
- Advanced solving techniques based on human solving strategies  
- UI/UX inspired by modern puzzle game design principles
- Thanks to the open-source community for the excellent tools and libraries

---

**Enjoy playing Sudoku Master!** 🎯

Challenge yourself, learn new techniques, and become a Sudoku solving expert!