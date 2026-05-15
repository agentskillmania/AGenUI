/**
 * A2UI 流式协议解析器
 * 包装 WASM ProtocolStreamExtractor，提供 JS 友好的 API
 */

import { loadWasmModule, getWasmModule } from './wasm-loader';
import type { ParseResult } from '../types/sdk';

interface WasmModule {
  createParser: () => WasmParser;
  destroyParser: (parser: WasmParser) => void;
}

interface WasmParser {
  appendData: (data: string) => void;
  driveParserJson: () => string;
  hasUnprocessedData: () => boolean;
  reset: () => void;
}

/**
 * A2UI 流式解析器
 * 将流式 A2UI 协议文本转换为结构化事件
 */
export class A2UIStreamParser {
  private wasmParser: WasmParser | null = null;
  private disposed = false;

  /**
   * 初始化解析器（异步，需要 WASM 模块）
   */
  async initialize(): Promise<void> {
    const module = await loadWasmModule() as WasmModule;
    this.wasmParser = module.createParser();
  }

  /**
   * 开始新一轮流式接收
   */
  begin(): void {
    this.ensureInitialized();
    this.wasmParser!.reset();
  }

  /**
   * 接收数据块
   * @param data A2UI 协议文本片段
   * @returns 解析结果列表
   */
  receiveChunk(data: string): ParseResult[] {
    this.ensureInitialized();
    this.wasmParser!.appendData(data);
    return this.driveParser();
  }

  /**
   * 结束当前轮次
   */
  end(): void {
    this.ensureInitialized();
    this.wasmParser!.reset();
  }

  /**
   * 驱动解析器并返回结果
   */
  private driveParser(): ParseResult[] {
    const jsonStr = this.wasmParser!.driveParserJson();
    try {
      const rawResults = JSON.parse(jsonStr) as Array<{
        type: number;
        eventType: number;
        eventJson: string;
        componentJson: string;
        surfaceId: string;
        version: string;
      }>;

      return rawResults.map((r) => this.convertParseResult(r));
    } catch {
      return [];
    }
  }

  /**
   * 将 WASM 原始结果转换为 JS 友好的 ParseResult
   */
  private convertParseResult(raw: {
    type: number;
    eventType: number;
    eventJson: string;
    componentJson: string;
    surfaceId: string;
    version: string;
  }): ParseResult {
    const typeMap: Record<number, ParseResult['type']> = {
      0: 'NormalEvent',
      1: 'ComponentUpdate',
    };

    const eventTypeMap: Record<number, ParseResult['eventType']> = {
      0: 'Unknown',
      1: 'CreateSurface',
      2: 'UpdateComponents',
      3: 'UpdateDataModel',
      4: 'AppendDataModel',
      5: 'DeleteSurface',
    };

    return {
      type: typeMap[raw.type] ?? 'NormalEvent',
      eventType: eventTypeMap[raw.eventType] ?? 'Unknown',
      eventJson: raw.eventJson || undefined,
      componentJson: raw.componentJson || undefined,
      surfaceId: raw.surfaceId || undefined,
      version: raw.version || undefined,
    };
  }

  /**
   * 释放解析器资源
   */
  dispose(): void {
    if (this.disposed || !this.wasmParser) return;

    try {
      const module = getWasmModule() as WasmModule;
      module.destroyParser(this.wasmParser);
    } catch {
      // Ignore cleanup errors
    }

    this.wasmParser = null;
    this.disposed = true;
  }

  private ensureInitialized(): void {
    if (this.disposed) {
      throw new Error('Parser has been disposed');
    }
    if (!this.wasmParser) {
      throw new Error('Parser not initialized. Call initialize() first.');
    }
  }
}
