/**
 * WASM 模块异步加载器
 * 负责加载和初始化 Emscripten 生成的 WASM 模块
 */

let wasmModule: unknown = null;
let wasmLoading: Promise<unknown> | null = null;

/**
 * 加载 WASM 模块
 * @param wasmUrl 自定义 WASM 二进制 URL（可选）
 */
export async function loadWasmModule(wasmUrl?: string): Promise<unknown> {
  if (wasmModule) {
    return wasmModule;
  }

  if (wasmLoading) {
    return wasmLoading;
  }

  wasmLoading = (async () => {
    try {
      // 动态导入 Emscripten 生成的 JS 胶水
      // @ts-expect-error WASM glue has no TS declarations
      const moduleFactory = await import('./agenui_parser.js');
      const createModule = moduleFactory.default || moduleFactory;

      const moduleConfig: Record<string, unknown> = {};
      if (wasmUrl) {
        moduleConfig.locateFile = (filename: string) => {
          if (filename.endsWith('.wasm')) {
            return wasmUrl;
          }
          return filename;
        };
      }

      wasmModule = await createModule(moduleConfig);
      return wasmModule;
    } catch (error) {
      wasmLoading = null;
      throw new Error(
        `Failed to load AGenUI WASM parser: ${error instanceof Error ? error.message : String(error)}. ` +
        `Make sure agenui_parser.js and agenui_parser.wasm are accessible.`
      );
    }
  })();

  return wasmLoading;
}

/**
 * 获取已加载的 WASM 模块
 */
export function getWasmModule(): unknown {
  if (!wasmModule) {
    throw new Error('WASM module not loaded. Call loadWasmModule() first.');
  }
  return wasmModule;
}

/**
 * 检查 WASM 模块是否已加载
 */
export function isWasmLoaded(): boolean {
  return wasmModule !== null;
}

/**
 * 重置 WASM 模块（用于测试）
 */
export function resetWasmModule(): void {
  wasmModule = null;
  wasmLoading = null;
}
