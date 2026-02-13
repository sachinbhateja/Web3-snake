
import { useState, useEffect } from 'react';

export type SwipeInput = {
  onSwipedLeft?: () => void;
  onSwipedRight?: () => void;
  onSwipedUp?: () => void;
  onSwipedDown?: () => void;
};

export const useSwipe = (input: SwipeInput) => {
  const [touchStart, setTouchStart] = useState<[number, number] | null>(null);
  const [touchEnd, setTouchEnd] = useState<[number, number] | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart([e.targetTouches[0].clientX, e.targetTouches[0].clientY]);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd([e.targetTouches[0].clientX, e.targetTouches[0].clientY]);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchStart[0] - touchEnd[0];
    const distanceY = touchStart[1] - touchEnd[1];

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (distanceX > minSwipeDistance) {
        input.onSwipedLeft?.();
      } else if (distanceX < -minSwipeDistance) {
        input.onSwipedRight?.();
      }
    } else {
      if (distanceY > minSwipeDistance) {
        input.onSwipedUp?.();
      } else if (distanceY < -minSwipeDistance) {
        input.onSwipedDown?.();
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const gameBoard = document.getElementById('game-board');
    if (gameBoard) {
      gameBoard.addEventListener('touchstart', onTouchStart);
      gameBoard.addEventListener('touchmove', onTouchMove);
      gameBoard.addEventListener('touchend', onTouchEnd);
    }
    
    return () => {
      if (gameBoard) {
        gameBoard.removeEventListener('touchstart', onTouchStart);
        gameBoard.removeEventListener('touchmove', onTouchMove);
        gameBoard.removeEventListener('touchend', onTouchEnd);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touchStart, touchEnd]);
};
