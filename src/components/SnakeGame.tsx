import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check if food eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (optional, but looks neon)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#ff00ff';
      ctx.shadowBlur = index === 0 ? 15 : 5;
      ctx.shadowColor = index === 0 ? '#00ffff' : '#ff00ff';
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
    });

    // Draw food
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ffff';
    ctx.fillRect(food.x * cellSize + 4, food.y * cellSize + 4, cellSize - 8, cellSize - 8);

    ctx.shadowBlur = 0; // Reset shadow
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-4 bg-black border-4 border-cyan-400 shadow-[8px_8px_#f0f]">
      <div className="flex flex-col sm:flex-row gap-4 w-full mb-2">
        <div className="flex-1 border-2 border-cyan-400 bg-black p-2 flex items-center justify-center shadow-[4px_4px_#f0f]">
          <span className="text-cyan-400 font-pixel text-xs">
            DATA_SCORE: {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex-1 border-2 border-magenta-500 bg-black p-2 flex items-center justify-center shadow-[4px_4px_#0ff]">
          <span className={`text-magenta-500 font-pixel text-xs ${gameOver || isPaused ? 'animate-pulse' : ''}`}>
            {gameOver ? 'SYS_FAILURE' : isPaused ? 'SYS_PAUSED' : 'SYS_ACTIVE'}
          </span>
        </div>
      </div>
      
      <div className="relative border-4 border-cyan-400 shadow-[8px_8px_#f0f]">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black"
        />
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <h3 className="text-2xl font-pixel text-cyan-400 mb-8 glitch-overlay" data-text={gameOver ? "TERMINATED" : "INTERRUPTED"}>
              {gameOver ? "TERMINATED" : "INTERRUPTED"}
            </h3>
            <button
              onClick={gameOver ? resetGame : () => setIsPaused(false)}
              className="btn-glitch"
            >
              {gameOver ? 'REBOOT_SYS' : 'RESUME_LINK'}
            </button>
          </div>
        )}
      </div>

      <div className="text-magenta-500 text-[10px] font-pixel opacity-70 flex flex-col items-center gap-1">
        <p>[ ARROW_KEYS ] :: NAVIGATE_GRID</p>
        <p>[ SPACE_BAR ] :: TOGGLE_PAUSE</p>
      </div>
    </div>
  );
};
