import type { ReactNode } from 'react';

export interface AGenUIComponentProps {
  id: string;
  type: string;
  properties: Record<string, unknown>;
  children?: ReactNode;
  onAction?: (action: string, context?: Record<string, unknown>) => void;
  onSyncState?: (change: Record<string, unknown>) => void;
}

export type ComponentRenderer = (props: AGenUIComponentProps) => ReactNode;
