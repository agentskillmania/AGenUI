import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { AGenUIComponentProps } from '../types';

export const Markdown: React.FC<AGenUIComponentProps> = ({ properties }) => {
  const { text, style } = properties;

  return (
    <div style={style as React.CSSProperties}>
      <ReactMarkdown>{(text as string) || ''}</ReactMarkdown>
    </div>
  );
};
