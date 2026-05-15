import React from 'react';
import type { AGenUIComponentProps } from '../types';

export const Web: React.FC<AGenUIComponentProps> = ({ properties }) => {
  const { url, width, height, style } = properties;

  return (
    <iframe
      src={url as string}
      width={width as string | number}
      height={height as string | number}
      style={{
        border: 'none',
        ...style as React.CSSProperties,
      }}
      sandbox="allow-scripts allow-same-origin allow-popups"
      title="Web Content"
    />
  );
};
