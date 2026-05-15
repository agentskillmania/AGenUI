import React from 'react';
import { Card as AntCard } from 'antd';
import type { AGenUIComponentProps } from '../types';

export const Card: React.FC<AGenUIComponentProps> = ({ properties, children }) => {
  const { title, extra, bordered, hoverable, style } = properties;

  return (
    <AntCard
      title={title as React.ReactNode}
      extra={extra as React.ReactNode}
      bordered={bordered !== false}
      hoverable={hoverable as boolean}
      style={style as React.CSSProperties}
    >
      {children}
    </AntCard>
  );
};
