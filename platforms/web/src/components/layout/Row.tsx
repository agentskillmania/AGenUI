import React from 'react';
import { Row as AntRow } from 'antd';
import type { AGenUIComponentProps } from '../types';

export const Row: React.FC<AGenUIComponentProps> = ({ properties, children }) => {
  const { justify, align, gutter, wrap, style } = properties;

  return (
    <AntRow
      justify={justify as React.ComponentProps<typeof AntRow>['justify']}
      align={align as React.ComponentProps<typeof AntRow>['align']}
      gutter={gutter as number | [number, number]}
      wrap={wrap as boolean}
      style={style as React.CSSProperties}
    >
      {children}
    </AntRow>
  );
};
