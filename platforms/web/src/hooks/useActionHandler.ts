import { useCallback } from 'react';
import type { ActionEvent } from '../types/sdk';

export function useActionHandler(
  onAction?: (action: ActionEvent) => void
): (action: ActionEvent) => void {
  return useCallback(
    (action: ActionEvent) => {
      onAction?.(action);
    },
    [onAction]
  );
}
