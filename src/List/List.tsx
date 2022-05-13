import React, { useEffect, useRef, useState } from 'react';

import * as S from './List.style';

const useScrollLoading = (onNewLoad: () => void, loadTirgerDistance: number) => {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWindowScroll = () => {
      if (box.current) {
        const rect = box.current.getBoundingClientRect();
        const client = {
          height: document.documentElement.clientHeight,
        };

        const bottomEdge = rect.top + rect.height;
        const buttomEdgeOverlay = bottomEdge - client.height;
        if (buttomEdgeOverlay <= loadTirgerDistance) {
          onNewLoad();
        }
      }
    };

    const animationDescriptor = {
      current: 0,
    };

    const handleAnimationFrame = () => {
      handleWindowScroll();

      animationDescriptor.current = requestAnimationFrame(handleAnimationFrame);
    };

    animationDescriptor.current = requestAnimationFrame(handleAnimationFrame);

    window.addEventListener('scroll', handleWindowScroll);

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
      cancelAnimationFrame(animationDescriptor.current);
    };
  }, []);

  return {
    ref: box,
  };
};

export const List = () => {
  const [count, setCount] = useState(0);
  const callNextCount = () => {
    setCount(count + 5);
  };

  const nextCount = useRef(callNextCount);
  nextCount.current = callNextCount;

  const handleNewLoad = () => {
    nextCount.current();
  };

  const { ref } = useScrollLoading(handleNewLoad, 50);

  return (
    <S.List ref={ref}>
      {new Array(count).fill(null).map((_item, index) => {
        // eslint-disable-next-line react/no-array-index-key
        return <S.Item key={index} />;
      })}
    </S.List>
  );
};
