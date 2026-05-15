/**
 * AGenUI Web SDK
 * React + antd + antv 渲染引擎 for A2UI 协议
 */

// 核心 API
export { AGenUI } from './AGenUI';
export { SurfaceManager } from './SurfaceManager';
export { AGenUISurface } from './components/Surface';

// React Hooks
export { useAGenUI } from './hooks/useAGenUI';
export { useSurfaceManager } from './hooks/useSurfaceManager';
export { useActionHandler } from './hooks/useActionHandler';

// 组件注册
export {
  registerComponent,
  getComponentRenderer,
  hasComponent,
  getRegisteredTypes,
} from './components/registry';

// 类型
export type {
  AGenUIConfig,
  AGenUIComponent,
  AGenUISurfaceState,
  ActionEvent,
  SyncUIToDataEvent,
  ParseResult,
  FunctionHandler,
  LayoutBridge,
} from './types/sdk';

export type {
  AGenUIComponentProps,
  ComponentRenderer,
} from './components/types';

export type { AGenUISurfaceProps } from './components/Surface';

// ===== 组件注册（内联，确保不被 tree-shake）=====
import { registerComponent } from './components/registry';

// 布局
import { Row } from './components/layout/Row';
import { Column } from './components/layout/Column';
import { List } from './components/layout/List';
import { Card } from './components/layout/Card';
import { Tabs } from './components/layout/Tabs';
import { Modal } from './components/layout/Modal';
import { Carousel } from './components/layout/Carousel';

// 基础
import { Text } from './components/basic/Text';
import { Image } from './components/basic/Image';
import { Icon } from './components/basic/Icon';
import { Button } from './components/basic/Button';
import { Divider } from './components/basic/Divider';
import { Web } from './components/basic/Web';

// 输入
import { TextField } from './components/input/TextField';
import { CheckBox } from './components/input/CheckBox';
import { ChoicePicker } from './components/input/ChoicePicker';
import { Slider } from './components/input/Slider';
import { DateTimeInput } from './components/input/DateTimeInput';

// 媒体
import { Video } from './components/media/Video';
import { AudioPlayer } from './components/media/AudioPlayer';
import { Lottie } from './components/media/Lottie';

// 数据
import { Table } from './components/data/Table';
import { RichText } from './components/data/RichText';
import { Markdown } from './components/data/Markdown';

// 图表
import { Chart } from './components/chart/Chart';

// 注册
registerComponent('Row', Row);
registerComponent('Column', Column);
registerComponent('List', List);
registerComponent('Card', Card);
registerComponent('Tabs', Tabs);
registerComponent('Modal', Modal);
registerComponent('Carousel', Carousel);
registerComponent('Text', Text);
registerComponent('Image', Image);
registerComponent('Icon', Icon);
registerComponent('Button', Button);
registerComponent('Divider', Divider);
registerComponent('Web', Web);
registerComponent('TextField', TextField);
registerComponent('CheckBox', CheckBox);
registerComponent('ChoicePicker', ChoicePicker);
registerComponent('Slider', Slider);
registerComponent('DateTimeInput', DateTimeInput);
registerComponent('Video', Video);
registerComponent('AudioPlayer', AudioPlayer);
registerComponent('Lottie', Lottie);
registerComponent('Table', Table);
registerComponent('RichText', RichText);
registerComponent('Markdown', Markdown);
registerComponent('Chart', Chart);
