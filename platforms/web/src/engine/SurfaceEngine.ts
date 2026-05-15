/**
 * Surface 状态引擎
 * 管理所有 Surface 的组件树、数据模型和事件
 * 在 JS 层实现虚拟 DOM 状态管理（替代 C++ 核心中的 SurfaceCoordinator + Surface）
 */

import type { AGenUIComponent, AGenUISurfaceState, ActionEvent, SyncUIToDataEvent } from '../types/sdk';

type SurfaceEventListener = (event: SurfaceEvent) => void;

export interface SurfaceEvent {
  type: 'createSurface' | 'updateComponents' | 'deleteSurface' | 'action' | 'syncUIToData' | 'interactionStatus';
  surfaceId: string;
  payload?: unknown;
}

/**
 * 单 Surface 状态管理
 */
class SurfaceState {
  surfaceId: string;
  catalogId: string;
  theme: Record<string, string>;
  components: Map<string, AGenUIComponent>;
  dataModel: unknown;
  private parentMap: Map<string, string>; // childId -> parentId

  constructor(surfaceId: string, catalogId: string, theme: Record<string, string>) {
    this.surfaceId = surfaceId;
    this.catalogId = catalogId;
    this.theme = theme;
    this.components = new Map();
    this.dataModel = {};
    this.parentMap = new Map();
  }

  /**
   * 更新组件列表
   * @param componentsJson 组件 JSON 字符串数组
   */
  updateComponents(componentsJson: string[]): void {
    const newComponents = new Map<string, AGenUIComponent>();
    const newParentMap = new Map<string, string>();

    for (const json of componentsJson) {
      try {
        const component = JSON.parse(json) as AGenUIComponent;
        if (component.id) {
          newComponents.set(component.id, component);
          // 记录父子关系
          if (component.children && Array.isArray(component.children)) {
            for (const childId of component.children) {
              newParentMap.set(childId, component.id);
            }
          }
        }
      } catch {
        // 忽略解析失败的组件
      }
    }

    this.components = newComponents;
    this.parentMap = newParentMap;
  }

  /**
   * 更新单个组件（增量更新）
   */
  updateComponent(componentJson: string): void {
    try {
      const component = JSON.parse(componentJson) as AGenUIComponent;
      if (component.id) {
        this.components.set(component.id, component);
        if (component.children && Array.isArray(component.children)) {
          for (const childId of component.children) {
            this.parentMap.set(childId, component.id);
          }
        }
      }
    } catch {
      // 忽略解析失败
    }
  }

  /**
   * 获取根组件列表（没有父组件的组件）
   */
  getRootComponents(): AGenUIComponent[] {
    const roots: AGenUIComponent[] = [];
    for (const [id, component] of this.components) {
      if (!this.parentMap.has(id)) {
        roots.push(component);
      }
    }
    return roots;
  }

  /**
   * 获取子组件
   */
  getChildren(parentId: string): AGenUIComponent[] {
    const children: AGenUIComponent[] = [];
    for (const [childId, pid] of this.parentMap) {
      if (pid === parentId) {
        const child = this.components.get(childId);
        if (child) children.push(child);
      }
    }
    return children;
  }

  /**
   * 更新数据模型
   */
  updateDataModel(path: string, value: unknown): void {
    if (path === '/' || path === '') {
      this.dataModel = value;
      return;
    }

    const segments = path.split('/').filter(Boolean);
    let current = this.dataModel as Record<string, unknown>;
    if (typeof current !== 'object' || current === null) {
      this.dataModel = {};
      current = this.dataModel as Record<string, unknown>;
    }

    for (let i = 0; i < segments.length - 1; i++) {
      const key = segments[i];
      if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }

    current[segments[segments.length - 1]] = value;
  }

  /**
   * 追加数据模型（用于流式文本）
   */
  appendDataModel(path: string, value: string): void {
    const segments = path.split('/').filter(Boolean);
    let current = this.dataModel as Record<string, unknown>;
    if (typeof current !== 'object' || current === null) {
      this.dataModel = {};
      current = this.dataModel as Record<string, unknown>;
    }

    for (let i = 0; i < segments.length - 1; i++) {
      const key = segments[i];
      if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }

    const lastKey = segments[segments.length - 1];
    const existing = current[lastKey];
    if (typeof existing === 'string') {
      current[lastKey] = existing + value;
    } else {
      current[lastKey] = value;
    }
  }

  /**
   * 解析数据绑定表达式
   * 支持 ${path.to.value} 语法
   */
  resolveBinding(expression: string): unknown {
    if (!expression.startsWith('${') || !expression.endsWith('}')) {
      return expression;
    }

    const path = expression.slice(2, -1).trim();
    const segments = path.split('.');
    let current = this.dataModel;

    for (const segment of segments) {
      if (current === null || current === undefined) return undefined;
      if (typeof current !== 'object') return undefined;
      current = (current as Record<string, unknown>)[segment];
    }

    return current;
  }
}

/**
 * Surface 引擎
 * 管理所有 Surface 实例和事件分发
 */
export class SurfaceEngine {
  private surfaces = new Map<string, SurfaceState>();
  private listeners = new Set<SurfaceEventListener>();

  /**
   * 创建 Surface
   */
  createSurface(surfaceId: string, catalogId: string, theme: Record<string, string>): void {
    const surface = new SurfaceState(surfaceId, catalogId, theme);
    this.surfaces.set(surfaceId, surface);
    this.emitEvent({ type: 'createSurface', surfaceId });
  }

  /**
   * 删除 Surface
   */
  deleteSurface(surfaceId: string): void {
    this.surfaces.delete(surfaceId);
    this.emitEvent({ type: 'deleteSurface', surfaceId });
  }

  /**
   * 更新组件
   */
  updateComponents(surfaceId: string, componentsJson: string[]): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;

    surface.updateComponents(componentsJson);
    this.emitEvent({
      type: 'updateComponents',
      surfaceId,
      payload: { components: Array.from(surface.components.values()) },
    });
  }

  /**
   * 更新单个组件
   */
  updateComponent(surfaceId: string, componentJson: string): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;

    surface.updateComponent(componentJson);
    this.emitEvent({
      type: 'updateComponents',
      surfaceId,
      payload: { component: JSON.parse(componentJson) },
    });
  }

  /**
   * 更新数据模型
   */
  updateDataModel(surfaceId: string, path: string, value: unknown): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;

    surface.updateDataModel(path, value);
  }

  /**
   * 追加数据模型
   */
  appendDataModel(surfaceId: string, path: string, value: string): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;

    surface.appendDataModel(path, value);
  }

  /**
   * 获取 Surface 状态
   */
  getSurface(surfaceId: string): SurfaceState | undefined {
    return this.surfaces.get(surfaceId);
  }

  /**
   * 获取所有 Surface ID
   */
  getSurfaceIds(): string[] {
    return Array.from(this.surfaces.keys());
  }

  /**
   * 提交 UI Action
   */
  submitAction(surfaceId: string, componentId: string, context?: Record<string, unknown>): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;

    const action: ActionEvent = {
      surfaceId,
      sourceComponentId: componentId,
      context,
    };

    this.emitEvent({ type: 'action', surfaceId, payload: action });
  }

  /**
   * 同步 UI 到数据
   */
  syncUIToData(surfaceId: string, componentId: string, change: Record<string, unknown>): void {
    const surface = this.surfaces.get(surfaceId);
    if (!surface) return;

    const event: SyncUIToDataEvent = {
      surfaceId,
      componentId,
      change,
    };

    this.emitEvent({ type: 'syncUIToData', surfaceId, payload: event });
  }

  /**
   * 添加事件监听器
   */
  addListener(listener: SurfaceEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * 移除事件监听器
   */
  removeListener(listener: SurfaceEventListener): void {
    this.listeners.delete(listener);
  }

  private emitEvent(event: SurfaceEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch {
        // 忽略监听器错误
      }
    }
  }
}
