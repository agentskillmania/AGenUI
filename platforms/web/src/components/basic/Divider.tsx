import React from 'react';
import { Divider as AntDivider } from 'antd';
import type { AGenUIComponentProps } from '../types';

export const Divider: React.FC<AGenUIComponentProps> = ({ properties, children }) => {
  const { orientation, type, dashed, plain, style } = properties;

  return (
    <AntDivider
      orientation={orientation as 'horizontal' | 'vertical' | undefined}
      titlePlacement={type as 'left' | 'right' | 'center' | undefined}
      dashed={dashed as boolean}
      plain={plain as boolean}
      style={style as React.CSSProperties}
    >
      {children}
    </AntDivider>
  );
};
