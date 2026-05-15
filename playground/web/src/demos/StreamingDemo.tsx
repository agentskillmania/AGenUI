import React, { useState, useCallback, useEffect } from 'react';
import { Button, Input, Space, Card, message, Tag } from 'antd';
import { SurfaceManager, AGenUISurface, AGenUI } from '@agenui/web';

const { TextArea } = Input;

// 初始 A2UI 协议数据 —— 模拟 LLM 流式输出一个交互界面
const SAMPLE_STREAM = `{"createSurface":{"surfaceId":"demo-surface-1","catalogId":"urn:a2ui:catalog:agenui_catalog","theme":{"themeId":"default"}}}
{"updateComponents":{"surfaceId":"demo-surface-1","version":"v0.9","components":[{"id":"root","type":"Column","children":["headerCard","introText","actionRow"]},{"id":"headerCard","type":"Card","title":"🤖 AGenUI 流式渲染演示","style":{"marginBottom":24},"children":["headerContent"]},{"id":"headerContent","type":"Column","children":["descText","hintText"]},{"id":"descText","type":"Text","text":"这段界面不是写死的，而是模拟 LLM 实时生成的 A2UI 协议数据，被 WASM 解析器逐段解析后渲染出来的。","variant":"body"},{"id":"hintText","type":"Text","text":"试试点击下面的按钮，观察 Action 回调如何驱动 UI 状态变化。","style":{"color":"#888","marginTop":8},"variant":"secondary"},{"id":"actionRow","type":"Row","gutter":16,"align":"middle","children":["actionCol1","actionCol2","actionCol3"]},{"id":"actionCol1","type":"Column","span":8,"children":["mainButton"]},{"id":"actionCol2","type":"Column","span":8,"children":["statusTag"]},{"id":"actionCol3","type":"Column","span":8,"children":["resultText"]},{"id":"mainButton","type":"Button","text":"👉 点击与我交互","variant":"primary"},{"id":"statusTag","type":"Text","text":"等待交互...","style":{"color":"#999"}},{"id":"resultText","type":"Text","text":"","style":{"color":"#1890ff"}}]}}
{"updateDataModel":{"surfaceId":"demo-surface-1","path":"/","value":{"user":"Web User"}}}`;

export const StreamingDemo: React.FC = () => {
  const [input, setInput] = useState(SAMPLE_STREAM);
  const [surfaceManager, setSurfaceManager] = useState<SurfaceManager | null>(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const startStreaming = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setLog([]);
    try {
      await AGenUI.initialize();

      const sm = new SurfaceManager();
      await sm.initialize();
      setSurfaceManager(sm);

      sm.beginTextStream();

      const chunks = input.split('\n');
      for (const chunk of chunks) {
        if (chunk.trim()) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          sm.receiveTextChunk(chunk.trim() + '\n');
          setLog((prev) => [...prev, `⬅️ 收到 chunk: ${chunk.substring(0, 60)}...`]);
        }
      }

      sm.endTextStream();
      setLog((prev) => [...prev, '✅ 流式输入完成，界面已渲染']);
      message.success('流式输入完成');
    } catch (err) {
      message.error(`错误: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }, [input]);

  const handleAction = useCallback(
    (action: unknown) => {
      const a = action as { surfaceId?: string; sourceComponentId?: string; context?: Record<string, unknown> };
      const { surfaceId, sourceComponentId } = a;

      message.info(`🎯 收到 Action: ${sourceComponentId}`);
      setLog((prev) => [
        ...prev,
        `🎯 Action 事件: sourceComponentId=${sourceComponentId}, surfaceId=${surfaceId}`,
      ]);

      // 动态更新 UI：把按钮改成"已点击"状态，并显示结果
      const engine = surfaceManager?.getEngine();
      if (engine && surfaceId) {
        engine.updateComponent(
          surfaceId,
          JSON.stringify({
            id: 'mainButton',
            type: 'Button',
            text: '✅ 已点击',
            variant: 'default',
            disabled: true,
          })
        );
        engine.updateComponent(
          surfaceId,
          JSON.stringify({
            id: 'statusTag',
            type: 'Text',
            text: '🎉 交互成功',
            style: { color: '#52c41a', fontWeight: 'bold' },
          })
        );
        engine.updateComponent(
          surfaceId,
          JSON.stringify({
            id: 'resultText',
            type: 'Text',
            text: `你点击了「${sourceComponentId}」，Action 已回传至 onAction 回调，并通过 updateComponent 动态更新了这三个组件的状态。`,
            style: { color: '#1890ff' },
          })
        );
        setLog((prev) => [
          ...prev,
          '🔄 调用 engine.updateComponent() 动态更新 mainButton、statusTag、resultText',
        ]);
      }
    },
    [surfaceManager]
  );

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card title="A2UI 协议输入（模拟 LLM 流式输出）">
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={8}
          placeholder="输入 A2UI 协议 JSON..."
        />
        <Button
          type="primary"
          onClick={startStreaming}
          loading={loading}
          style={{ marginTop: 16 }}
        >
          开始流式输入
        </Button>
      </Card>

      {surfaceManager && (
        <Card title="🖥️ 渲染结果（AGenUISurface）">
          <AGenUISurface
            surfaceManager={surfaceManager}
            height={300}
            onAction={handleAction}
          />
        </Card>
      )}

      {log.length > 0 && (
        <Card title="📋 事件日志" bodyStyle={{ background: '#f6ffed' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {log.map((line, i) => (
              <div key={i} style={{ fontSize: 13, fontFamily: 'monospace' }}>
                {line}
              </div>
            ))}
          </Space>
        </Card>
      )}
    </Space>
  );
};

// Auto-start component for default view
export const AutoStreamingDemo: React.FC = () => {
  const [surfaceManager, setSurfaceManager] = useState<SurfaceManager | null>(null);
  const [log, setLog] = useState<string[]>(['⏳ 正在初始化 WASM 解析器...']);

  const handleAction = useCallback(
    (action: unknown) => {
      const a = action as { surfaceId?: string; sourceComponentId?: string; context?: Record<string, unknown> };
      const { surfaceId, sourceComponentId } = a;

      message.info(`🎯 收到 Action: ${sourceComponentId}`);
      setLog((prev) => [
        ...prev,
        `🎯 Action 事件: sourceComponentId=${sourceComponentId}`,
      ]);

      const engine = surfaceManager?.getEngine();
      if (engine && surfaceId) {
        engine.updateComponent(
          surfaceId,
          JSON.stringify({
            id: 'mainButton',
            type: 'Button',
            text: '✅ 已点击',
            variant: 'default',
            disabled: true,
          })
        );
        engine.updateComponent(
          surfaceId,
          JSON.stringify({
            id: 'statusTag',
            type: 'Text',
            text: '🎉 交互成功',
            style: { color: '#52c41a', fontWeight: 'bold' },
          })
        );
        engine.updateComponent(
          surfaceId,
          JSON.stringify({
            id: 'resultText',
            type: 'Text',
            text: `你点击了「${sourceComponentId}」，Action 已回传至 onAction 回调，并通过 updateComponent 动态更新了这三个组件的状态。`,
            style: { color: '#1890ff' },
          })
        );
        setLog((prev) => [
          ...prev,
          '🔄 调用 engine.updateComponent() 动态更新 mainButton、statusTag、resultText',
        ]);
      }
    },
    [surfaceManager]
  );

  useEffect(() => {
    let sm: SurfaceManager | null = null;
    const init = async () => {
      try {
        await AGenUI.initialize();
        setLog((prev) => [...prev, '✅ WASM 初始化完成']);

        sm = new SurfaceManager();
        await sm.initialize();
        setSurfaceManager(sm);
        setLog((prev) => [...prev, '✅ SurfaceManager 初始化完成']);

        sm.beginTextStream();
        const chunks = SAMPLE_STREAM.split('\n');
        for (const chunk of chunks) {
          if (chunk.trim()) {
            sm.receiveTextChunk(chunk.trim() + '\n');
          }
        }
        sm.endTextStream();
        setLog((prev) => [...prev, '✅ A2UI 协议解析完成，界面已渲染']);
      } catch (err) {
        console.error('AutoStreamingDemo error:', err);
        setLog((prev) => [...prev, `❌ 错误: ${err instanceof Error ? err.message : String(err)}`]);
      }
    };
    init();
    return () => {
      sm?.destroy();
    };
  }, []);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {surfaceManager && (
        <Card title="🖥️ 渲染结果（由 A2UI 协议实时生成）">
          <AGenUISurface
            surfaceManager={surfaceManager}
            height={300}
            onAction={handleAction}
          />
        </Card>
      )}

      <Card title="📋 事件日志" bodyStyle={{ background: '#f6ffed' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {log.map((line, i) => (
            <div key={i} style={{ fontSize: 13, fontFamily: 'monospace' }}>
              {line}
            </div>
          ))}
        </Space>
      </Card>
    </Space>
  );
};
