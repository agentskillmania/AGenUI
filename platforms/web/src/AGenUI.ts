/**
 * AGenUI 全局引擎单例
 * 管理 WASM 模块、主题、函数注册
 */

import { loadWasmModule } from './bridge/wasm-loader';
import { SurfaceManager } from './SurfaceManager';
import type { AGenUIConfig, FunctionHandler } from './types/sdk';

class AGenUIEngine {
  private initialized = false;
  private themeConfig: Record<string, unknown> | null = null;
  private designTokenConfig: Record<string, unknown> | null = null;
  private functions = new Map<string, FunctionHandler>();
  private surfaceManagers = new Set<SurfaceManager>();

  /**
   * 初始化全局引擎
   */
  async initialize(config?: AGenUIConfig): Promise<void> {
    if (this.initialized) {
      return;
    }

    await loadWasmModule();

    if (config?.themeConfig) {
      this.themeConfig = config.themeConfig;
    }

    if (config?.designTokenConfig) {
      this.designTokenConfig = config.designTokenConfig;
    }

    this.initialized = true;
  }

  /**
   * 检查是否已初始化
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * 设置昼夜模式
   */
  setDayNightMode(mode: 'light' | 'dark'): void {
    // TODO: 实现主题切换
    console.log(`[AGenUI] Day/night mode: ${mode}`);
  }

  /**
   * 注册函数
   */
  registerFunction(name: string, handler: FunctionHandler): boolean {
    this.functions.set(name, handler);
    return true;
  }

  /**
   * 注销函数
   */
  unregisterFunction(name: string): boolean {
    return this.functions.delete(name);
  }

  /**
   * 获取已注册函数
   */
  getFunction(name: string): FunctionHandler | undefined {
    return this.functions.get(name);
  }

  /**
   * 注册 SurfaceManager（内部使用）
   */
  registerSurfaceManager(sm: SurfaceManager): void {
    this.surfaceManagers.add(sm);
  }

  /**
   * 注销 SurfaceManager（内部使用）
   */
  unregisterSurfaceManager(sm: SurfaceManager): void {
    this.surfaceManagers.delete(sm);
  }

  /**
   * 获取引擎版本
   */
  getEngineVersion(): string {
    return '0.9.10';
  }
}

// 全局单例
const globalEngine = new AGenUIEngine();

export const AGenUI = {
  initialize: (config?: AGenUIConfig) => globalEngine.initialize(config),
  isInitialized: () => globalEngine.isInitialized(),
  setDayNightMode: (mode: 'light' | 'dark') => globalEngine.setDayNightMode(mode),
  registerFunction: (name: string, handler: FunctionHandler) => globalEngine.registerFunction(name, handler),
  unregisterFunction: (name: string) => globalEngine.unregisterFunction(name),
  getEngineVersion: () => globalEngine.getEngineVersion(),
  // 内部 API
  _registerSurfaceManager: (sm: SurfaceManager) => globalEngine.registerSurfaceManager(sm),
  _unregisterSurfaceManager: (sm: SurfaceManager) => globalEngine.unregisterSurfaceManager(sm),
};
