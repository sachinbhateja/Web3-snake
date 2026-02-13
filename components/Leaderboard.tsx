
import React from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  scores: LeaderboardEntry[];
  bestScore: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ scores, bestScore }) => {
  return (
    <div className="w-full md:w-64 lg:w-72 p-4 bg-white/10 dark:bg-black/20 rounded-2xl shadow-lg backdrop-blur-md border border-white/20">
      <h2 className="text-xl font-bold text-center mb-4">High Scores</h2>
      <div className="mb-4 text-center">
        <p className="text-sm uppercase text-gray-500 dark:text-gray-400">Best Score</p>
        <p className="text-3xl font-bold text-sky-500">{bestScore}</p>
      </div>
      <ul className="space-y-2">
        {scores.length > 0 ? (
          scores.map((entry, index) => (
            <li
              key={index}
              className="flex justify-between items-center p-2 rounded-lg bg-white/10 dark:bg-black/20"
            >
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                #{index + 1}
              </span>
              <span className="font-bold">{entry.score} pts</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(entry.date).toLocaleDateString()}
              </span>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No scores yet. Play a game!</p>
        )}
      </ul>
    </div>
  );
};

export default Leaderboard;
