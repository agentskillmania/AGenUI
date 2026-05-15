/**
 * AGenUI Web SDK 类型定义
 */

// ===== 组件类型 =====
export interface AGenUIComponent {
  id: string;
  type: string;
  [key: string]: unknown;
}

export interface AGenUISurfaceState {
  surfaceId: string;
  catalogId?: string;
  theme?: Record<string, string>;
  components: AGenUIComponent[];
  dataModel?: unknown;
}

// ===== 事件类型 =====
export interface ActionEvent {
  surfaceId: string;
  sourceComponentId: string;
  context?: Record<string, unknown>;
}

export interface SyncUIToDataEvent {
  surfaceId: string;
  componentId: string;
  change: Record<string, unknown>;
}

// ===== 流式解析结果 =====
export interface ParseResult {
  type: 'NormalEvent' | 'ComponentUpdate';
  eventType: 'Unknown' | 'CreateSurface' | 'UpdateComponents' | 'UpdateDataModel' | 'AppendDataModel' | 'DeleteSurface';
  eventJson?: string;
  componentJson?: string;
  surfaceId?: string;
  version?: string;
}

// ===== SDK 配置 =====
export interface AGenUIConfig {
  wasmUrl?: string;
  themeConfig?: Record<string, unknown>;
  designTokenConfig?: Record<string, unknown>;
  componentStyles?: Record<string, unknown>;
}

// ===== 函数处理器 =====
export type SyncFunctionHandler = (params: Record<string, unknown>) => unknown;
export type AsyncFunctionHandler = (
  params: Record<string, unknown>,
  callback: (result: unknown, error?: string) => void
) => void;
export type FunctionHandler = SyncFunctionHandler | AsyncFunctionHandler;

// ===== 布局桥接 =====
export interface LayoutBridge {
  getDeviceWidth(): number;
  getDeviceHeight(): number;
  getDeviceDensity(): number;
}
