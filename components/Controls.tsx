
import React from 'react';
import ArrowIcon from './icons/ArrowIcon';
import { Direction } from '../types';

interface ControlsProps {
  onDirectionChange: (direction: Direction) => void;
}

const ControlButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`w-16 h-16 rounded-full flex items-center justify-center bg-white/20 dark:bg-black/30 backdrop-blur-sm border border-white/20 hover:bg-white/30 dark:hover:bg-black/40 transition-all ${className}`}
  >
    {children}
  </button>
);

const Controls: React.FC<ControlsProps> = ({ onDirectionChange }) => {
  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-2 w-52 h-52 md:hidden">
      <div className="col-start-2">
        <ControlButton onClick={() => onDirectionChange(Direction.UP)}>
          <ArrowIcon direction="up" />
        </ControlButton>
      </div>
      <div className="row-start-2">
        <ControlButton onClick={() => onDirectionChange(Direction.LEFT)}>
          <ArrowIcon direction="left" />
        </ControlButton>
      </div>
      <div className="col-start-3 row-start-2">
        <ControlButton onClick={() => onDirectionChange(Direction.RIGHT)}>
          <ArrowIcon direction="right" />
        </ControlButton>
      </div>
      <div className="col-start-2 row-start-3">
        <ControlButton onClick={() => onDirectionChange(Direction.DOWN)}>
          <ArrowIcon direction="down" />
        </ControlButton>
      </div>
    </div>
  );
};

export default Controls;
