
import React, { useState, useEffect, useCallback } from 'react';
import { useInterval } from '../hooks/useInterval';
import { useSwipe } from '../hooks/useSwipe';
import Header from './Header';
import Leaderboard from './Leaderboard';
import Controls from './Controls';
import { Direction, Coords, LeaderboardEntry, TxStatus } from '../types';
import { BOARD_SIZE, INITIAL_SPEED, SPEED_INCREMENT } from '../constants';
import { connectWallet, submitScoreToContract } from '../lib/blockchain';

interface GameProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Game: React.FC<GameProps> = ({ theme, toggleTheme }) => {
  const getInitialSnake = () => [{ x: 10, y: 10 }, { x: 10, y: 11 }];
  const createFood = (snake: Coords[]) => {
    let foodPos: Coords;
    do {
      foodPos = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (snake.some(segment => segment.x === foodPos.x && segment.y === foodPos.y));
    return foodPos;
  };
  
  const [snake, setSnake] = useState<Coords[]>(getInitialSnake);
  const [food, setFood] = useState<Coords>(createFood(snake));
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [speed, setSpeed] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  
  // Leaderboard logic
  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem('snakeScores') || '[]');
    setLeaderboard(storedScores);
    const storedBest = parseInt(localStorage.getItem('snakeBestScore') || '0', 10);
    setBestScore(storedBest);
  }, []);

  const updateLeaderboard = (newScore: number) => {
    const newEntry = { score: newScore, date: new Date().toISOString() };
    const updatedScores = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    setLeaderboard(updatedScores);
    localStorage.setItem('snakeScores', JSON.stringify(updatedScores));

    if (newScore > bestScore) {
      setBestScore(newScore);
      localStorage.setItem('snakeBestScore', newScore.toString());
    }
  };

  const handleDirectionChange = useCallback((newDirection: Direction) => {
      const isOpposite = (dir1: Direction, dir2: Direction) =>
        (dir1 === Direction.UP && dir2 === Direction.DOWN) ||
        (dir1 === Direction.DOWN && dir2 === Direction.UP) ||
        (dir1 === Direction.LEFT && dir2 === Direction.RIGHT) ||
        (dir1 === Direction.RIGHT && dir2 === Direction.LEFT);
        
      if (!isOpposite(direction, newDirection)) {
        setDirection(newDirection);
      }
    }, [direction]);

  useSwipe({
    onSwipedUp: () => handleDirectionChange(Direction.UP),
    onSwipedDown: () => handleDirectionChange(Direction.DOWN),
    onSwipedLeft: () => handleDirectionChange(Direction.LEFT),
    onSwipedRight: () => handleDirectionChange(Direction.RIGHT),
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp': handleDirectionChange(Direction.UP); break;
        case 'ArrowDown': handleDirectionChange(Direction.DOWN); break;
        case 'ArrowLeft': handleDirectionChange(Direction.LEFT); break;
        case 'ArrowRight': handleDirectionChange(Direction.RIGHT); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirectionChange]);

  const startGame = () => {
    setSnake(getInitialSnake());
    setFood(createFood(getInitialSnake()));
    setDirection(Direction.UP);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setScore(0);
    setTxStatus('idle');
    setTxHash(null);
    setTxError(null);
  };

  const gameLoop = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case Direction.UP: head.y -= 1; break;
      case Direction.DOWN: head.y += 1; break;
      case Direction.LEFT: head.x -= 1; break;
      case Direction.RIGHT: head.x += 1; break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
      setGameOver(true);
      setSpeed(null);
      updateLeaderboard(score);
      return;
    }

    // Self collision
    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      setSpeed(null);
      updateLeaderboard(score);
      return;
    }

    newSnake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
      setScore(prev => prev + 1);
      setFood(createFood(newSnake));
      setSpeed(prev => Math.max(50, (prev || INITIAL_SPEED) - SPEED_INCREMENT));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };
  
  useInterval(gameLoop, speed);

  const handleConnectWallet = async () => {
    const address = await connectWallet();
    if (address) {
      setConnectedAddress(address);
    }
  };

  const handleSubmitScore = async () => {
    if (score === 0) {
        alert('Score must be greater than 0 to submit.');
        return;
    }
    setTxStatus('pending');
    setTxError(null);
    try {
      const tx = await submitScoreToContract(score);
      setTxHash(tx.hash);
      await tx.wait();
      setTxStatus('success');
    } catch (error: any) {
      console.error(error);
      setTxStatus('error');
      setTxError(error.message || 'An unknown error occurred.');
    }
  };

  const renderCell = (x: number, y: number) => {
    const isSnake = snake.some(seg => seg.x === x && seg.y === y);
    const isHead = snake[0].x === x && snake[0].y === y;
    const isFood = food.x === x && food.y === y;
    let cellClass = 'w-full h-full rounded-sm transition-all duration-200';
    if (isHead) cellClass += ' bg-sky-400 dark:bg-sky-300 rounded-md scale-110 shadow-lg shadow-sky-500/50';
    else if (isSnake) cellClass += ' bg-sky-600 dark:bg-sky-500';
    else if (isFood) cellClass += ' bg-red-500 dark:bg-red-400 animate-food-pulse rounded-full';
    else cellClass += ' bg-gray-200/50 dark:bg-gray-800/50';
    return <div className={cellClass} />;
  };
  
  const getTxMessage = () => {
    switch(txStatus) {
        case 'pending': return 'Submitting score to blockchain...';
        case 'success': return 'Score submitted successfully!';
        case 'error': return txError;
        default: return null;
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        connectedAddress={connectedAddress} 
        onConnectWallet={handleConnectWallet}
      />
      <div className="w-full flex flex-col md:flex-row justify-center items-center md:items-start gap-8 mt-4">
        <div className="order-2 md:order-1 flex flex-col items-center gap-4">
          <Leaderboard scores={leaderboard} bestScore={bestScore} />
        </div>
        
        <div className="order-1 md:order-2 flex-grow flex flex-col items-center gap-4">
            <div className="w-full flex justify-center items-center h-16">
                 <p className="text-4xl font-bold">Score: <span className="text-sky-500">{score}</span></p>
            </div>
            <div 
              id="game-board"
              className="relative aspect-square w-full max-w-lg p-2 bg-white/10 dark:bg-black/20 rounded-2xl shadow-lg backdrop-blur-md border border-white/20"
            >
              <div className="grid gap-0.5" style={{gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`}}>
                {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => (
                  <div key={i} className="aspect-square">
                    {renderCell(i % BOARD_SIZE, Math.floor(i / BOARD_SIZE))}
                  </div>
                ))}
              </div>
              
              {!connectedAddress && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl gap-4 text-white text-center p-4">
                  <h2 className="text-3xl font-bold">Welcome to Web3 Snake!</h2>
                  <p>Connect your wallet on the Base network to start playing.</p>
                  <button onClick={handleConnectWallet} className="px-6 py-3 rounded-lg bg-sky-500 text-white font-bold text-lg hover:bg-sky-600 transition-colors animate-pulse-glow">
                    Connect Wallet
                  </button>
                </div>
              )}

              {connectedAddress && (gameOver || speed === null) && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl gap-4 text-white">
                  {gameOver && <h2 className="text-5xl font-bold text-red-500 animate-pulse">Game Over</h2>}
                  <p className="text-2xl">Final Score: {score}</p>
                  <button onClick={startGame} className="px-6 py-3 rounded-lg bg-sky-500 text-white font-bold text-lg hover:bg-sky-600 transition-colors animate-pulse-glow">
                    {gameOver ? 'Play Again' : 'Start Game'}
                  </button>
                  {gameOver && (
                    <div className="flex flex-col items-center gap-2 mt-2">
                        <button 
                            onClick={handleSubmitScore} 
                            disabled={txStatus === 'pending' || txStatus === 'success'}
                            className="px-6 py-2 rounded-lg bg-green-600 text-white font-bold disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                        >
                            {txStatus === 'pending' ? 'Submitting...' : 'Submit Score to Chain'}
                        </button>
                        {txStatus !== 'idle' && (
                            <div className="text-center mt-2">
                                <p className={`text-sm ${txStatus === 'error' ? 'text-red-400' : 'text-gray-300'}`}>{getTxMessage()}</p>
                                {txHash && <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-400 hover:underline">View on Basescan</a>}
                            </div>
                        )}
                    </div>
                  )}
                </div>
              )}
            </div>
          <Controls onDirectionChange={handleDirectionChange} />
        </div>
      </div>
    </div>
  );
};

export default Game;
