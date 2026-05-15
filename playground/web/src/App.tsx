import React, { useState } from 'react';
import { Tabs, Layout, Typography } from 'antd';
import { AutoStreamingDemo } from './demos/StreamingDemo';
import { ComponentShowcase } from './demos/ComponentShowcase';

const { Header, Content } = Layout;
const { Title } = Typography;

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('streaming');

  const items = [
    {
      key: 'streaming',
      label: '流式输入测试',
      children: <AutoStreamingDemo />,
    },
    {
      key: 'components',
      label: '组件展示',
      children: <ComponentShowcase />,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <Title level={3} style={{ margin: '16px 0' }}>
          AGenUI Web Playground
        </Title>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
      </Content>
    </Layout>
  );
};
