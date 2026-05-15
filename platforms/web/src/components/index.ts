/**
 * 组件注册入口
 * 导入并注册所有 AGenUI → antd/antv 组件映射
 * 注意：此模块在加载时自动执行副作用（注册组件），不可被 tree-shake
 */

import { registerComponent } from './registry';

// ===== 布局组件 =====
import { Row } from './layout/Row';
import { Column } from './layout/Column';
import { List } from './layout/List';
import { Card } from './layout/Card';
import { Tabs } from './layout/Tabs';
import { Modal } from './layout/Modal';
import { Carousel } from './layout/Carousel';

// ===== 基础组件 =====
import { Text } from './basic/Text';
import { Image } from './basic/Image';
import { Icon } from './basic/Icon';
import { Button } from './basic/Button';
import { Divider } from './basic/Divider';
import { Web } from './basic/Web';

// ===== 输入组件 =====
import { TextField } from './input/TextField';
import { CheckBox } from './input/CheckBox';
import { ChoicePicker } from './input/ChoicePicker';
import { Slider } from './input/Slider';
import { DateTimeInput } from './input/DateTimeInput';

// ===== 媒体组件 =====
import { Video } from './media/Video';
import { AudioPlayer } from './media/AudioPlayer';
import { Lottie } from './media/Lottie';

// ===== 数据组件 =====
import { Table } from './data/Table';
import { RichText } from './data/RichText';
import { Markdown } from './data/Markdown';

// ===== 图表组件 =====
import { Chart } from './chart/Chart';

// ===== 注册所有组件（模块加载时自动执行）=====
// 布局
registerComponent('Row', Row);
registerComponent('Column', Column);
registerComponent('List', List);
registerComponent('Card', Card);
registerComponent('Tabs', Tabs);
registerComponent('Modal', Modal);
registerComponent('Carousel', Carousel);

// 基础
registerComponent('Text', Text);
registerComponent('Image', Image);
registerComponent('Icon', Icon);
registerComponent('Button', Button);
registerComponent('Divider', Divider);
registerComponent('Web', Web);

// 输入
registerComponent('TextField', TextField);
registerComponent('CheckBox', CheckBox);
registerComponent('ChoicePicker', ChoicePicker);
registerComponent('Slider', Slider);
registerComponent('DateTimeInput', DateTimeInput);

// 媒体
registerComponent('Video', Video);
registerComponent('AudioPlayer', AudioPlayer);
registerComponent('Lottie', Lottie);

// 数据
registerComponent('Table', Table);
registerComponent('RichText', RichText);
registerComponent('Markdown', Markdown);

// 图表
registerComponent('Chart', Chart);

// 副作用标记，防止被 tree-shake
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__AGENUI_COMPONENTS_REGISTERED__ = true;
}

// 重新导出
export { registerComponent, getComponentRenderer, hasComponent, getRegisteredTypes } from './registry';
export type { AGenUIComponentProps, ComponentRenderer } from './types';
