/**
 * AGenUISurface React 组件
 * 渲染 A2UI Surface 的完整组件树
 */

import React, { useEffect, useState, useCallback } from 'react';
import type { SurfaceManager } from '../SurfaceManager';
import type { SurfaceEvent } from '../engine/SurfaceEngine';
import type { AGenUIComponent, ActionEvent } from '../types/sdk';
import { getComponentRenderer } from './registry';
import './index';

export interface AGenUISurfaceProps {
  surfaceManager: SurfaceManager;
  width?: number | string;
  height?: number | string;
  onAction?: (action: ActionEvent) => void;
  onInteractionStatus?: (type: number, content: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

interface SurfaceState {
  surfaceId: string;
  components: AGenUIComponent[];
}

export const AGenUISurface: React.FC<AGenUISurfaceProps> = ({
  surfaceManager,
  width = '100%',
  height = '100%',
  onAction,
  onInteractionStatus,
  style,
  className,
}) => {
  const [surfaces, setSurfaces] = useState<Map<string, SurfaceState>>(() => {
    // 初始化时同步获取已有 Surface 状态
    const engine = surfaceManager.getEngine();
    const initial = new Map<string, SurfaceState>();
    for (const surfaceId of engine.getSurfaceIds()) {
      const surface = engine.getSurface(surfaceId);
      if (surface) {
        initial.set(surfaceId, {
          surfaceId,
          components: surface.getRootComponents(),
        });
      }
    }
    return initial;
  });

  const handleEvent = useCallback(
    (event: SurfaceEvent) => {
      switch (event.type) {
        case 'createSurface': {
          setSurfaces((prev) => {
            const next = new Map(prev);
            next.set(event.surfaceId, { surfaceId: event.surfaceId, components: [] });
            return next;
          });
          break;
        }
        case 'updateComponents': {
          const engine = surfaceManager.getEngine();
          const surface = engine.getSurface(event.surfaceId);
          if (surface) {
            setSurfaces((prev) => {
              const next = new Map(prev);
              next.set(event.surfaceId, {
                surfaceId: event.surfaceId,
                components: surface.getRootComponents(),
              });
              return next;
            });
          }
          break;
        }
        case 'deleteSurface': {
          setSurfaces((prev) => {
            const next = new Map(prev);
            next.delete(event.surfaceId);
            return next;
          });
          break;
        }
        case 'action':
          onAction?.(event.payload as ActionEvent);
          break;
      }
    },
    [surfaceManager, onAction]
  );

  useEffect(() => {
    const unsubscribe = surfaceManager.getEngine().addListener(handleEvent);
    return () => unsubscribe();
  }, [surfaceManager, handleEvent]);

  const handleComponentAction = useCallback(
    (surfaceId: string, componentId: string, _action: string, context?: Record<string, unknown>) => {
      surfaceManager.submitUIAction({
        surfaceId,
        sourceComponentId: componentId,
        context,
      });
    },
    [surfaceManager]
  );

  const renderComponent = useCallback(
    (surfaceId: string, component: AGenUIComponent): React.ReactNode => {
      const renderer = getComponentRenderer(component.type);
      if (!renderer) {
        console.warn(`[AGenUI] Unknown component type: ${component.type}`);
        return null;
      }

      const { id, type, ...properties } = component;
      const engine = surfaceManager.getEngine();
      const surface = engine.getSurface(surfaceId);
      const children = surface?.getChildren(id) || [];

      return (
        <React.Fragment key={id}>
          {renderer({
            id,
            type,
            properties: properties as Record<string, unknown>,
            children: children.map((child) => renderComponent(surfaceId, child)),
            onAction: (_action, context) => handleComponentAction(surfaceId, id, _action, context),
          })}
        </React.Fragment>
      );
    },
    [surfaceManager, handleComponentAction]
  );

  const containerStyle: React.CSSProperties = {
    width,
    height,
    overflow: 'auto',
    ...style,
  };

  return (
    <div className={`agenui-surface ${className || ''}`} style={containerStyle}>
      {Array.from(surfaces.values()).map((surface) => (
        <div key={surface.surfaceId} className="agenui-surface-instance">
          {surface.components.map((component) => renderComponent(surface.surfaceId, component))}
        </div>
      ))}
    </div>
  );
};

AGenUISurface.displayName = 'AGenUISurface';
