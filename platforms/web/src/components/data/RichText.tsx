import React from 'react';
import { Typography } from 'antd';
import type { AGenUIComponentProps } from '../types';

export const RichText: React.FC<AGenUIComponentProps> = ({ properties }) => {
  const { text, style } = properties;

  return (
    <Typography
      style={style as React.CSSProperties}
      dangerouslySetInnerHTML={{ __html: (text as string) || '' }}
    />
  );
};
