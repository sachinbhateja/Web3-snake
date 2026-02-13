
import React from 'react';

interface ArrowIconProps {
  direction: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

const ArrowIcon: React.FC<ArrowIconProps> = ({ direction, className }) => {
  const rotations: { [key: string]: string } = {
    up: '-rotate-90',
    down: 'rotate-90',
    left: 'rotate-180',
    right: 'rotate-0',
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-6 w-6 transform ${rotations[direction]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
};

export default ArrowIcon;
