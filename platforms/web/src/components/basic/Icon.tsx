import React from 'react';
import * as Icons from '@ant-design/icons';
import type { AGenUIComponentProps } from '../types';

export const Icon: React.FC<AGenUIComponentProps> = ({ properties }) => {
  const { name, size, color, style } = properties;
  const iconName = (name as string) || 'QuestionCircleOutlined';

  // 动态获取图标组件
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ style?: React.CSSProperties }>>)[iconName];

  if (!IconComponent) {
    console.warn(`[AGenUI] Unknown icon: ${iconName}`);
    return null;
  }

  const iconStyle: React.CSSProperties = {
    fontSize: size as number | string,
    color: color as string,
    ...style as React.CSSProperties,
  };

  return <IconComponent style={iconStyle} />;
};
