import React from 'react';
import type { AGenUIComponentProps } from '../types';

export const Video: React.FC<AGenUIComponentProps> = ({ properties }) => {
  const { url, width, height, autoplay, controls, loop, muted, style } = properties;

  return (
    <video
      src={url as string}
      width={width as string | number}
      height={height as string | number}
      autoPlay={autoplay as boolean}
      controls={controls !== false}
      loop={loop as boolean}
      muted={muted as boolean}
      style={style as React.CSSProperties}
      playsInline
    />
  );
};
