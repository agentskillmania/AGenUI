import React from 'react';
import { List as AntList } from 'antd';
import type { AGenUIComponentProps } from '../types';

export const List: React.FC<AGenUIComponentProps> = ({ properties, children }) => {
  const { header, footer, bordered, split, size, style } = properties;
  const childArray = React.Children.toArray(children);

  const items = childArray.map((child, index) => ({
    key: index,
    children: child,
  }));

  return (
    <AntList
      header={header as React.ReactNode}
      footer={footer as React.ReactNode}
      bordered={bordered as boolean}
      split={split !== false}
      size={size as 'small' | 'default' | 'large'}
      style={style as React.CSSProperties}
      dataSource={items}
      renderItem={(item) => <AntList.Item key={item.key}>{item.children}</AntList.Item>}
    />
  );
};
