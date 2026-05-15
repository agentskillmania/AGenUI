/**
 * SurfaceManager
 * 按实例管理 A2UI 流式输入和 UI 状态
 * 替代 C++ 核心中的 ISurfaceManager
 */

import { A2UIStreamParser } from './bridge/A2UIStreamParser';
import { SurfaceEngine } from './engine/SurfaceEngine';
import { AGenUI } from './AGenUI';
import type { ParseResult, ActionEvent, SyncUIToDataEvent } from './types/sdk';
import type { SurfaceEvent } from './engine/SurfaceEngine';

let nextInstanceId = 1;

export class SurfaceManager {
  readonly instanceId: number;
  private parser: A2UIStreamParser;
  private engine: SurfaceEngine;
  private eventListeners = new Set<(event: SurfaceEvent) => void>();
  private disposed = false;

  constructor() {
    this.instanceId = nextInstanceId++;
    this.parser = new A2UIStreamParser();
    this.engine = new SurfaceEngine();

    // 监听引擎事件并转发
    this.engine.addListener((event) => {
      for (const listener of this.eventListeners) {
        try {
          listener(event);
        } catch {
          // 忽略监听器错误
        }
      }
    });

    AGenUI._registerSurfaceManager(this);
  }

  /**
   * 初始化（异步加载 WASM）
   */
  async initialize(): Promise<void> {
    await this.parser.initialize();
  }

  getInstanceId(): number {
    return this.instanceId;
  }

  // ===== 流式输入 =====

  beginTextStream(): void {
    this.ensureNotDisposed();
    this.parser.begin();
  }

  receiveTextChunk(data: string): void {
    this.ensureNotDisposed();
    const results = this.parser.receiveChunk(data);
    this.processParseResults(results);
  }

  endTextStream(): void {
    this.ensureNotDisposed();
    this.parser.end();
  }

  // ===== 交互 =====

  submitUIAction(action: ActionEvent): void {
    this.ensureNotDisposed();
    this.engine.submitAction(action.surfaceId, action.sourceComponentId, action.context);
  }

  submitUIDataModel(syncMsg: SyncUIToDataEvent): void {
    this.ensureNotDisposed();
    this.engine.syncUIToData(syncMsg.surfaceId, syncMsg.componentId, syncMsg.change);
  }

  // ===== 事件 =====

  on(event: string, handler: (event: SurfaceEvent) => void): void {
    this.eventListeners.add(handler);
  }

  off(event: string, handler: (event: SurfaceEvent) => void): void {
    this.eventListeners.delete(handler);
  }

  // ===== 引擎访问 =====

  getEngine(): SurfaceEngine {
    return this.engine;
  }

  // ===== 生命周期 =====

  destroy(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.parser.dispose();
    AGenUI._unregisterSurfaceManager(this);
  }

  // ===== 内部 =====

  private processParseResults(results: ParseResult[]): void {
    for (const result of results) {
      if (result.type === 'NormalEvent') {
        this.processNormalEvent(result);
      } else {
        this.processComponentUpdate(result);
      }
    }
  }

  private processNormalEvent(result: ParseResult): void {
    if (!result.eventJson) return;

    try {
      const eventData = JSON.parse(result.eventJson);

      switch (result.eventType) {
        case 'CreateSurface': {
          // Support both formats: {"createSurface": {...}} and flat {...}
          const payload = eventData.createSurface || eventData;
          const surfaceId = payload.surfaceId || '';
          const catalogId = payload.catalogId || '';
          const theme = payload.theme || {};
          this.engine.createSurface(surfaceId, catalogId, theme);
          break;
        }

        case 'UpdateDataModel': {
          const surfaceId = eventData.surfaceId || '';
          const path = eventData.path || '/';
          const value = eventData.value;
          this.engine.updateDataModel(surfaceId, path, value);
          break;
        }

        case 'AppendDataModel': {
          const surfaceId = eventData.surfaceId || '';
          const path = eventData.path || '/';
          const value = typeof eventData.value === 'string' ? eventData.value : JSON.stringify(eventData.value);
          this.engine.appendDataModel(surfaceId, path, value);
          break;
        }

        case 'UpdateComponents': {
          const surfaceId = eventData.updateComponents?.surfaceId || eventData.surfaceId || '';
          const components = eventData.updateComponents?.components || eventData.components || [];
          if (Array.isArray(components) && components.length > 0) {
            this.engine.updateComponents(surfaceId, components.map((c: unknown) => 
              typeof c === 'string' ? c : JSON.stringify(c)
            ));
          }
          break;
        }

        case 'DeleteSurface': {
          const surfaceId = eventData.surfaceId || '';
          this.engine.deleteSurface(surfaceId);
          break;
        }
      }
    } catch {
      // 忽略解析错误
    }
  }

  private processComponentUpdate(result: ParseResult): void {
    if (!result.componentJson || !result.surfaceId) return;

    // ComponentUpdate 类型表示单个组件从 updateComponents 流式提取而来
    // 使用增量更新，避免覆盖已有组件
    this.engine.updateComponent(result.surfaceId, result.componentJson);
  }

  private ensureNotDisposed(): void {
    if (this.disposed) {
      throw new Error('SurfaceManager has been destroyed');
    }
  }
}
