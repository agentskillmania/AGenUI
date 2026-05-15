import React from 'react';
import type { AGenUIComponentProps } from '../types';

export const AudioPlayer: React.FC<AGenUIComponentProps> = ({ properties }) => {
  const { url, autoplay, controls, loop, muted, style } = properties;

  return (
    <audio
      src={url as string}
      autoPlay={autoplay as boolean}
      controls={controls !== false}
      loop={loop as boolean}
      muted={muted as boolean}
      style={style as React.CSSProperties}
    />
  );
};
