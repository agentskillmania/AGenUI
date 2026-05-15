import React from 'react';
import { Carousel as AntCarousel } from 'antd';
import type { AGenUIComponentProps } from '../types';

export const Carousel: React.FC<AGenUIComponentProps> = ({ properties, children }) => {
  const { autoplay, autoplaySpeed, dots, effect, style } = properties;

  return (
    <AntCarousel
      autoplay={autoplay as boolean}
      autoplaySpeed={autoplaySpeed as number}
      dots={dots !== false}
      effect={effect as 'scrollx' | 'fade'}
      style={style as React.CSSProperties}
    >
      {children}
    </AntCarousel>
  );
};
