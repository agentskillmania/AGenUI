import React from 'react';
import { Col } from 'antd';
import type { AGenUIComponentProps } from '../types';

export const Column: React.FC<AGenUIComponentProps> = ({ properties, children }) => {
  const { span, offset, push, pull, order, flex, style } = properties;

  return (
    <Col
      span={span as number}
      offset={offset as number}
      push={push as number}
      pull={pull as number}
      order={order as number}
      flex={flex as string | number}
      style={{ display: 'flex', flexDirection: 'column', gap: 12, ...style as React.CSSProperties }}
    >
      {children}
    </Col>
  );
};
