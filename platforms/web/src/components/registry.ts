/**
 * 组件注册表
 * 将 AGenUI 组件类型映射到 React 组件渲染器
 */

import type { ComponentRenderer } from './types';

const registry = new Map<string, ComponentRenderer>();

/**
 * 注册组件渲染器
 */
export function registerComponent(type: string, renderer: ComponentRenderer): void {
  registry.set(type, renderer);
}

/**
 * 获取组件渲染器
 */
export function getComponentRenderer(type: string): ComponentRenderer | undefined {
  return registry.get(type);
}

/**
 * 检查组件类型是否已注册
 */
export function hasComponent(type: string): boolean {
  return registry.has(type);
}

/**
 * 获取所有已注册组件类型
 */
export function getRegisteredTypes(): string[] {
  return Array.from(registry.keys());
}
