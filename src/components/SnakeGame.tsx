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
      ctx.fillStyle = index === 0 ? '#00ffcc' : '#00ccaa';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ffcc';
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
    });

    // Draw food
    ctx.fillStyle = '#ff0066';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff0066';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.shadowBlur = 0; // Reset shadow
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-black/40 rounded-2xl border border-cyan-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.1)]">
      <div className="flex gap-0 w-full mb-6">
        <div className="flex-1 border-2 border-cyan-500/50 bg-cyan-500/10 py-3 px-4 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <span className="text-cyan-400 font-digital text-3xl font-black tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]">
            SCORE: {score}
          </span>
        </div>
        <div className="flex-1 border-2 border-pink-500/50 bg-pink-500/10 py-3 px-4 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)]">
          <span className={`text-pink-500 font-digital text-3xl font-black tracking-widest ${gameOver || isPaused ? 'animate-glitch' : ''} drop-shadow-[0_0_10px_rgba(236,72,153,0.9)]`}>
            {gameOver ? 'GAME OVER' : isPaused ? 'PAUSED' : 'PLAYING'}
          </span>
        </div>
      </div>
      
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-lg border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
        />
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg backdrop-blur-[2px]">
            <button
              onClick={gameOver ? resetGame : () => setIsPaused(false)}
              className="px-12 py-4 bg-cyan-400 text-black font-digital font-black text-xl rounded-full hover:bg-cyan-300 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(34,211,238,0.8)] border-2 border-white/20"
            >
              {gameOver ? 'RESTART' : 'RESUME'}
            </button>
          </div>
        )}
      </div>

      <div className="text-gray-500 text-sm font-mono">
        USE ARROW KEYS TO MOVE • SPACE TO PAUSE
      </div>
    </div>
  );
};
