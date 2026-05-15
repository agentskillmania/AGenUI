import React, { useEffect, useState } from 'react';
import { Space, Typography } from 'antd';
import { SurfaceManager, AGenUISurface, AGenUI } from '@agenui/web';

const { Title } = Typography;

// 简单的 Lottie 动画数据（旋转的圆）
const demoLottieData = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: 'Demo',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Shape',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [{ i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] }, { t: 60, s: [360] }] },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'el',
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [40, 40] },
            },
            {
              ty: 'fl',
              c: { a: 0, k: [0.22, 0.53, 0.96, 1] },
              o: { a: 0, k: 100 },
              r: 1,
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
    },
  ],
};

// 25 组件全量 Demo 数据 — 使用垂直 Column 布局避免挤压
const demoComponents = [
  // ===== Root =====
  {
    id: 'root',
    type: 'Column',
    children: [
      'title',
      'divider1',
      'layoutSectionTitle',
      'rowColumnCard',
      'tabsCard',
      'listCard',
      'carouselCard',
      'modalCard',
      'basicSectionTitle',
      'textCard',
      'imageCard',
      'iconCard',
      'buttonCard',
      'dividerCard',
      'inputSectionTitle',
      'textFieldCard',
      'checkBoxCard',
      'choicePickerCard',
      'sliderCard',
      'dateTimeCard',
      'mediaSectionTitle',
      'videoCard',
      'audioCard',
      'lottieCard',
      'dataSectionTitle',
      'tableCard',
      'richTextCard',
      'markdownCard',
      'chartSectionTitle',
      'chartCard',
    ],
  },

  // ===== Title =====
  { id: 'title', type: 'Text', text: 'AGenUI Web — 25 Components Showcase', variant: 'h1' },
  { id: 'divider1', type: 'Divider' },

  // ===== Layout Section =====
  {
    id: 'layoutSectionTitle',
    type: 'Text',
    text: 'Layout Components',
    variant: 'h3',
    style: { marginTop: 24, marginBottom: 16 },
  },

  // Row & Column Card
  {
    id: 'rowColumnCard',
    type: 'Card',
    title: '🎯 Row & Column 栅格系统',
    style: { marginBottom: 16 },
    children: ['layoutRow1'],
  },
  {
    id: 'layoutRow1',
    type: 'Row',
    gutter: 16,
    children: ['layoutCol1', 'layoutCol2', 'layoutCol3'],
  },
  {
    id: 'layoutCol1',
    type: 'Column',
    span: 8,
    children: ['layoutBox1'],
  },
  {
    id: 'layoutBox1',
    type: 'Text',
    text: 'Col 8',
    style: {
      display: 'block',
      textAlign: 'center',
      padding: '24px 0',
      background: '#e6f7ff',
      borderRadius: 4,
      fontSize: 16,
      fontWeight: 'bold',
    },
  },
  {
    id: 'layoutCol2',
    type: 'Column',
    span: 8,
    children: ['layoutBox2'],
  },
  {
    id: 'layoutBox2',
    type: 'Text',
    text: 'Col 8',
    style: {
      display: 'block',
      textAlign: 'center',
      padding: '24px 0',
      background: '#f6ffed',
      borderRadius: 4,
      fontSize: 16,
      fontWeight: 'bold',
    },
  },
  {
    id: 'layoutCol3',
    type: 'Column',
    span: 8,
    children: ['layoutBox3'],
  },
  {
    id: 'layoutBox3',
    type: 'Text',
    text: 'Col 8',
    style: {
      display: 'block',
      textAlign: 'center',
      padding: '24px 0',
      background: '#fff7e6',
      borderRadius: 4,
      fontSize: 16,
      fontWeight: 'bold',
    },
  },

  // Tabs Card
  {
    id: 'tabsCard',
    type: 'Card',
    title: '📑 Tabs 标签页',
    style: { marginBottom: 16 },
    children: ['layoutTabs'],
  },
  {
    id: 'layoutTabs',
    type: 'Tabs',
    tabType: 'card',
    tabTitles: ['📊 数据概览', '⚙️ 系统设置', '🔔 最近动态'],
    children: ['tabContent1', 'tabContent2', 'tabContent3'],
  },
  {
    id: 'tabContent1',
    type: 'Text',
    text: '📈 本周数据概览\n\n• 新增用户: 1,234\n• 活跃用户: 5,678\n• 转化率: 12.5%\n\n数据表现良好，继续保持！',
    style: {
      background: '#e6f7ff',
      padding: '20px 24px',
      borderRadius: 8,
      whiteSpace: 'pre-wrap',
      display: 'block',
      lineHeight: 1.8,
      color: '#0958d9',
    },
  },
  {
    id: 'tabContent2',
    type: 'Text',
    text: '⚙️ 系统偏好设置\n\n• 深色模式: 已关闭\n• 通知推送: 已开启\n• 自动保存: 每 5 分钟\n• 语言: 简体中文\n\n所有设置已同步到云端。',
    style: {
      background: '#f6ffed',
      padding: '20px 24px',
      borderRadius: 8,
      whiteSpace: 'pre-wrap',
      display: 'block',
      lineHeight: 1.8,
      color: '#389e0d',
    },
  },
  {
    id: 'tabContent3',
    type: 'Text',
    text: '🔔 最近通知\n\n• 系统更新 v2.3.0 已发布\n• 新组件 Carousel 已上线\n• 安全补丁已自动安装\n• 本周使用报告已生成\n\n点击标记为已读。',
    style: {
      background: '#fff7e6',
      padding: '20px 24px',
      borderRadius: 8,
      whiteSpace: 'pre-wrap',
      display: 'block',
      lineHeight: 1.8,
      color: '#ad6800',
    },
  },

  // List Card
  {
    id: 'listCard',
    type: 'Card',
    title: '📋 List 列表',
    style: { marginBottom: 16 },
    children: ['layoutList'],
  },
  {
    id: 'layoutList',
    type: 'List',
    header: 'List Demo',
    bordered: true,
    split: true,
    children: ['listItem1', 'listItem2', 'listItem3'],
  },
  {
    id: 'listItem1',
    type: 'Text',
    text: 'List Item 1 — 支持流式渲染',
  },
  {
    id: 'listItem2',
    type: 'Text',
    text: 'List Item 2 — 跨平台一致性',
  },
  {
    id: 'listItem3',
    type: 'Text',
    text: 'List Item 3 — 25+ 内置组件',
  },

  // Carousel Card
  {
    id: 'carouselCard',
    type: 'Card',
    title: '🎠 Carousel 轮播',
    style: { marginBottom: 16 },
    children: ['layoutCarousel'],
  },
  {
    id: 'layoutCarousel',
    type: 'Carousel',
    autoplay: true,
    autoplaySpeed: 3000,
    children: ['carousel1', 'carousel2', 'carousel3'],
  },
  {
    id: 'carousel1',
    type: 'Text',
    text: '🚀 高性能渲染引擎',
    variant: 'h4',
    style: {
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      padding: '50px 24px',
      borderRadius: 12,
      minHeight: 180,
      margin: 0,
    },
  },
  {
    id: 'carousel2',
    type: 'Text',
    text: '🎨 跨平台一致体验',
    variant: 'h4',
    style: {
      textAlign: 'center',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#fff',
      padding: '50px 24px',
      borderRadius: 12,
      minHeight: 180,
      margin: 0,
    },
  },
  {
    id: 'carousel3',
    type: 'Text',
    text: '🔧 易于扩展集成',
    variant: 'h4',
    style: {
      textAlign: 'center',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: '#fff',
      padding: '50px 24px',
      borderRadius: 12,
      minHeight: 180,
      margin: 0,
    },
  },

  // Modal Card
  {
    id: 'modalCard',
    type: 'Card',
    title: '🪟 Modal 对话框',
    style: { marginBottom: 16 },
    children: ['modalTriggerBtn'],
  },
  {
    id: 'modalTriggerBtn',
    type: 'Button',
    text: 'Open Modal',
    variant: 'primary',
  },
  {
    id: 'modal1',
    type: 'Modal',
    title: 'Demo Modal',
    open: false,
    footer: 'default',
    children: ['modalText'],
  },
  {
    id: 'modalText',
    type: 'Text',
    text: 'This is modal content with default footer buttons.',
  },

  // ===== Basic Section =====
  {
    id: 'basicSectionTitle',
    type: 'Text',
    text: 'Basic Components',
    variant: 'h3',
    style: { marginTop: 24, marginBottom: 16 },
  },

  // Text Card
  {
    id: 'textCard',
    type: 'Card',
    title: '📝 Text 文本',
    style: { marginBottom: 16 },
    children: ['textCardContent'],
  },
  {
    id: 'textCardContent',
    type: 'Column',
    children: ['textDemoH4', 'textDemoBody', 'textDemoCaption'],
  },
  {
    id: 'textDemoH4',
    type: 'Text',
    text: 'Heading 4 标题样式',
    variant: 'h4',
    style: { marginBottom: 8 },
  },
  {
    id: 'textDemoBody',
    type: 'Text',
    text: '正文内容，支持粗体和斜体样式展示',
    strong: true,
    style: { marginBottom: 8 },
  },
  {
    id: 'textDemoCaption',
    type: 'Text',
    text: 'Caption 说明文字，用于辅助提示信息',
    variant: 'caption',
  },

  // Image Card
  {
    id: 'imageCard',
    type: 'Card',
    title: '🖼️ Image 图片',
    style: { marginBottom: 16 },
    children: ['imageCardRow', 'imageDesc'],
  },
  {
    id: 'imageCardRow',
    type: 'Row',
    gutter: 16,
    children: ['imageCol1', 'imageCol2', 'imageCol3'],
  },
  { id: 'imageCol1', type: 'Column', span: 8, children: ['imageCoverLabel', 'imageCover'] },
  { id: 'imageCoverLabel', type: 'Text', text: 'cover', variant: 'caption', style: { marginBottom: 4, textAlign: 'center' } },
  {
    id: 'imageCover',
    type: 'Image',
    url: '/demo_photo.jpg',
    description: 'cover 模式',
    width: '100%',
    height: 120,
    fit: 'cover',
    style: { borderRadius: 8 },
  },
  { id: 'imageCol2', type: 'Column', span: 8, children: ['imageContainLabel', 'imageContain'] },
  { id: 'imageContainLabel', type: 'Text', text: 'contain', variant: 'caption', style: { marginBottom: 4, textAlign: 'center' } },
  {
    id: 'imageContain',
    type: 'Image',
    url: '/demo_photo.jpg',
    description: 'contain 模式',
    width: '100%',
    height: 120,
    fit: 'contain',
    style: { borderRadius: 8, background: '#f0f0f0' },
  },
  { id: 'imageCol3', type: 'Column', span: 8, children: ['imageFillLabel', 'imageFill'] },
  { id: 'imageFillLabel', type: 'Text', text: 'fill', variant: 'caption', style: { marginBottom: 4, textAlign: 'center' } },
  {
    id: 'imageFill',
    type: 'Image',
    url: '/demo_photo.jpg',
    description: 'fill 模式',
    width: '100%',
    height: 120,
    fit: 'fill',
    style: { borderRadius: 8 },
  },
  {
    id: 'imageDesc',
    type: 'Text',
    text: '同一张风景照片在 cover / contain / fill 三种模式下的差异',
    variant: 'caption',
    style: { marginTop: 8, textAlign: 'center' },
  },

  // Icon Card
  {
    id: 'iconCard',
    type: 'Card',
    title: '🎨 Icon 图标',
    style: { marginBottom: 16 },
    children: ['iconCardRow'],
  },
  {
    id: 'iconCardRow',
    type: 'Row',
    gutter: 24,
    justify: 'center',
    children: ['iconCol1', 'iconCol2', 'iconCol3', 'iconCol4'],
  },
  { id: 'iconCol1', type: 'Column', children: ['icon1'] },
  {
    id: 'icon1',
    type: 'Icon',
    name: 'SmileOutlined',
    size: 28,
    color: '#1890ff',
  },
  { id: 'iconCol2', type: 'Column', children: ['icon2'] },
  {
    id: 'icon2',
    type: 'Icon',
    name: 'HeartOutlined',
    size: 28,
    color: '#ff4d4f',
  },
  { id: 'iconCol3', type: 'Column', children: ['icon3'] },
  {
    id: 'icon3',
    type: 'Icon',
    name: 'StarOutlined',
    size: 28,
    color: '#faad14',
  },
  { id: 'iconCol4', type: 'Column', children: ['icon4'] },
  {
    id: 'icon4',
    type: 'Icon',
    name: 'BellOutlined',
    size: 28,
    color: '#52c41a',
  },

  // Button Card
  {
    id: 'buttonCard',
    type: 'Card',
    title: '🔘 Button 按钮',
    style: { marginBottom: 16 },
    children: ['buttonCardContent'],
  },
  {
    id: 'buttonCardContent',
    type: 'Column',
    children: ['btnRow', 'btnFeedback'],
  },
  {
    id: 'btnRow',
    type: 'Row',
    gutter: 12,
    justify: 'center',
    style: { marginBottom: 12 },
    children: ['btnCol1', 'btnCol2', 'btnCol3', 'btnCol4', 'btnCol5'],
  },
  { id: 'btnCol1', type: 'Column', children: ['basicBtnPrimary'] },
  { id: 'basicBtnPrimary', type: 'Button', text: 'Primary', variant: 'primary' },
  { id: 'btnCol2', type: 'Column', children: ['basicBtnDefault'] },
  { id: 'basicBtnDefault', type: 'Button', text: 'Default', variant: 'default' },
  { id: 'btnCol3', type: 'Column', children: ['basicBtnDashed'] },
  { id: 'basicBtnDashed', type: 'Button', text: 'Dashed', variant: 'dashed' },
  { id: 'btnCol4', type: 'Column', children: ['basicBtnText'] },
  { id: 'basicBtnText', type: 'Button', text: 'Text', variant: 'text' },
  { id: 'btnCol5', type: 'Column', children: ['basicBtnDanger'] },
  { id: 'basicBtnDanger', type: 'Button', text: 'Danger', danger: true },
  {
    id: 'btnFeedback',
    type: 'Text',
    text: '点击上方按钮查看交互效果',
    variant: 'caption',
    style: { textAlign: 'center', color: '#999' },
  },

  // Divider Card
  {
    id: 'dividerCard',
    type: 'Card',
    title: '➖ Divider 分割线',
    style: { marginBottom: 16 },
    children: ['dividerDemo'],
  },
  {
    id: 'dividerDemo',
    type: 'Divider',
    orientation: 'center',
    children: ['dividerText'],
  },
  {
    id: 'dividerText',
    type: 'Text',
    text: '基础组件展示完毕',
    style: { color: '#999', fontSize: 12 },
  },

  // ===== Input Section =====
  {
    id: 'inputSectionTitle',
    type: 'Text',
    text: 'Input Components',
    variant: 'h3',
    style: { marginTop: 24, marginBottom: 16 },
  },

  // TextField Card
  {
    id: 'textFieldCard',
    type: 'Card',
    title: '⌨️ TextField 输入框',
    style: { marginBottom: 16 },
    children: ['textFieldLabel', 'inputTextField'],
  },
  {
    id: 'textFieldLabel',
    type: 'Text',
    text: '用户名',
    style: { marginBottom: 4, fontSize: 12, color: '#666' },
  },
  {
    id: 'inputTextField',
    type: 'TextField',
    placeholder: '请输入用户名',
    value: 'AGenUI',
  },

  // CheckBox Card
  {
    id: 'checkBoxCard',
    type: 'Card',
    title: '☑️ CheckBox 复选框',
    style: { marginBottom: 16 },
    children: ['checkBoxRow'],
  },
  {
    id: 'checkBoxRow',
    type: 'Row',
    gutter: 8,
    align: 'middle',
    children: ['checkBoxCol1', 'checkBoxCol2'],
  },
  { id: 'checkBoxCol1', type: 'Column', children: ['inputCheckBox'] },
  { id: 'inputCheckBox', type: 'CheckBox', checked: true },
  { id: 'checkBoxCol2', type: 'Column', children: ['checkBoxLabel'] },
  {
    id: 'checkBoxLabel',
    type: 'Text',
    text: '同意用户协议和隐私政策',
  },

  // ChoicePicker Card
  {
    id: 'choicePickerCard',
    type: 'Card',
    title: '📋 ChoicePicker 选择器',
    style: { marginBottom: 16 },
    children: ['choicePickerLabel', 'inputChoicePicker'],
  },
  {
    id: 'choicePickerLabel',
    type: 'Text',
    text: '选择目标平台',
    style: { marginBottom: 4, fontSize: 12, color: '#666' },
  },
  {
    id: 'inputChoicePicker',
    type: 'ChoicePicker',
    value: 'web',
    options: [
      { label: 'Web', value: 'web' },
      { label: 'Android', value: 'android' },
      { label: 'iOS', value: 'ios' },
      { label: 'HarmonyOS', value: 'harmony' },
    ],
  },

  // Slider Card
  {
    id: 'sliderCard',
    type: 'Card',
    title: '🎚️ Slider 滑块',
    style: { marginBottom: 16 },
    children: ['sliderLabel', 'inputSlider'],
  },
  {
    id: 'sliderLabel',
    type: 'Text',
    text: '进度: 50%',
    style: { marginBottom: 4, fontSize: 12, color: '#666' },
  },
  { id: 'inputSlider', type: 'Slider', value: 50, min: 0, max: 100 },

  // DateTimeInput Card
  {
    id: 'dateTimeCard',
    type: 'Card',
    title: '📅 DateTimeInput 日期选择',
    style: { marginBottom: 16 },
    children: ['dateTimeLabel', 'inputDateTime'],
  },
  {
    id: 'dateTimeLabel',
    type: 'Text',
    text: '选择日期',
    style: { marginBottom: 4, fontSize: 12, color: '#666' },
  },
  {
    id: 'inputDateTime',
    type: 'DateTimeInput',
    mode: 'date',
    value: '2024-01-15',
  },

  // ===== Media Section =====
  {
    id: 'mediaSectionTitle',
    type: 'Text',
    text: 'Media Components',
    variant: 'h3',
    style: { marginTop: 24, marginBottom: 16 },
  },

  // Video Card
  {
    id: 'videoCard',
    type: 'Card',
    title: '🎬 Video 视频',
    style: { marginBottom: 16 },
    children: ['mediaVideo'],
  },
  {
    id: 'mediaVideo',
    type: 'Video',
    url: '/test_video.mp4',
    width: '100%',
    height: 200,
    controls: true,
  },

  // Audio Card
  {
    id: 'audioCard',
    type: 'Card',
    title: '🔊 Audio 音频',
    style: { marginBottom: 16 },
    children: ['mediaAudio'],
  },
  {
    id: 'mediaAudio',
    type: 'AudioPlayer',
    url: '/test_audio.mp3',
    controls: true,
  },

  // Lottie Card
  {
    id: 'lottieCard',
    type: 'Card',
    title: '✨ Lottie 动画',
    style: { marginBottom: 16 },
    children: ['lottieDesc', 'mediaLottie'],
  },
  {
    id: 'lottieDesc',
    type: 'Text',
    text: '渲染 JSON 格式的矢量动画',
    variant: 'caption',
    style: { marginBottom: 8, color: '#666' },
  },
  {
    id: 'mediaLottie',
    type: 'Lottie',
    url: '/lottie_demo.json',
    width: 120,
    height: 120,
    loop: true,
    autoplay: true,
  },

  // ===== Data Section =====
  {
    id: 'dataSectionTitle',
    type: 'Text',
    text: 'Data Components',
    variant: 'h3',
    style: { marginTop: 24, marginBottom: 16 },
  },

  // Table Card
  {
    id: 'tableCard',
    type: 'Card',
    title: '📊 Table 表格',
    style: { marginBottom: 16 },
    children: ['dataTable'],
  },
  {
    id: 'dataTable',
    type: 'Table',
    columns: [
      { title: '姓名', dataIndex: 'name', key: 'name' },
      { title: '年龄', dataIndex: 'age', key: 'age' },
      { title: '城市', dataIndex: 'city', key: 'city' },
      { title: '状态', dataIndex: 'status', key: 'status' },
    ],
    dataSource: [
      { id: '1', name: 'Alice', age: 24, city: 'Beijing', status: '活跃' },
      { id: '2', name: 'Bob', age: 30, city: 'Shanghai', status: '离线' },
      { id: '3', name: 'Charlie', age: 28, city: 'Shenzhen', status: '活跃' },
      { id: '4', name: 'David', age: 35, city: 'Hangzhou', status: '忙碌' },
      { id: '5', name: 'Eva', age: 22, city: 'Chengdu', status: '活跃' },
    ],
  },

  // RichText Card
  {
    id: 'richTextCard',
    type: 'Card',
    title: '📝 RichText 富文本',
    style: { marginBottom: 16 },
    children: ['dataRichText'],
  },
  {
    id: 'dataRichText',
    type: 'RichText',
    text: '<h3 style="margin-top:0">RichText 组件</h3><p>支持 <b>粗体</b>、<i>斜体</i> 和 <a href="https://github.com/AGenUI/AGenUI" target="_blank" style="color:#1890ff">超链接</a>。</p><ul><li>跨平台渲染</li><li>A2UI 协议驱动</li><li>25+ 内置组件</li></ul>',
  },

  // Markdown Card
  {
    id: 'markdownCard',
    type: 'Card',
    title: '📄 Markdown 文档',
    style: { marginBottom: 16 },
    children: ['dataMarkdown'],
  },
  {
    id: 'dataMarkdown',
    type: 'Markdown',
    text: '## Markdown 支持\n\n> AGenUI 支持 Markdown 渲染，适合展示文档和说明。\n\n### 特性列表\n\n- **流式渲染**：实时更新界面\n- **多平台**：Web / Android / iOS / HarmonyOS\n- **WASM 解析**：高性能协议解析\n\n### 代码示例\n\n```js\nconst engine = new SurfaceManager();\nengine.createSurface("demo", "catalog");\n```',
  },

  // ===== Chart Section =====
  {
    id: 'chartSectionTitle',
    type: 'Text',
    text: 'Chart Components',
    variant: 'h3',
    style: { marginTop: 24, marginBottom: 16 },
  },

  // Row 1: Bar + Line
  {
    id: 'chartRow1',
    type: 'Row',
    gutter: 16,
    children: ['chartBarCard', 'chartLineCard'],
  },
  {
    id: 'chartBarCard',
    type: 'Card',
    title: '📊 Bar 柱状图',
    style: { marginBottom: 16 },
    children: ['chartBar'],
  },
  {
    id: 'chartBar',
    type: 'Chart',
    chartType: 'bar',
    data: [
      { x: '一月', y: 65 }, { x: '二月', y: 85 }, { x: '三月', y: 45 },
      { x: '四月', y: 95 }, { x: '五月', y: 70 }, { x: '六月', y: 110 },
    ],
    width: 400,
    height: 250,
    config: { xField: 'x', yField: 'y', label: { position: 'top' } },
  },
  {
    id: 'chartLineCard',
    type: 'Card',
    title: '📈 Line 折线图',
    style: { marginBottom: 16 },
    children: ['chartLine'],
  },
  {
    id: 'chartLine',
    type: 'Chart',
    chartType: 'line',
    data: [
      { x: '周一', y: 120 }, { x: '周二', y: 180 }, { x: '周三', y: 150 },
      { x: '周四', y: 220 }, { x: '周五', y: 190 }, { x: '周六', y: 260 }, { x: '周日', y: 240 },
    ],
    width: 400,
    height: 250,
    config: { xField: 'x', yField: 'y', smooth: true },
  },

  // Row 2: Area + Column
  {
    id: 'chartRow2',
    type: 'Row',
    gutter: 16,
    children: ['chartAreaCard', 'chartColumnCard'],
  },
  {
    id: 'chartAreaCard',
    type: 'Card',
    title: '🏔️ Area 面积图',
    style: { marginBottom: 16 },
    children: ['chartArea'],
  },
  {
    id: 'chartArea',
    type: 'Chart',
    chartType: 'area',
    data: [
      { x: '一月', y: 65 }, { x: '二月', y: 85 }, { x: '三月', y: 45 },
      { x: '四月', y: 95 }, { x: '五月', y: 70 }, { x: '六月', y: 110 },
    ],
    width: 400,
    height: 250,
    config: { xField: 'x', yField: 'y' },
  },
  {
    id: 'chartColumnCard',
    type: 'Card',
    title: '📊 Column 条形图',
    style: { marginBottom: 16 },
    children: ['chartColumn'],
  },
  {
    id: 'chartColumn',
    type: 'Chart',
    chartType: 'column',
    data: [
      { x: '产品A', y: 38 }, { x: '产品B', y: 52 }, { x: '产品C', y: 28 },
      { x: '产品D', y: 45 }, { x: '产品E', y: 62 },
    ],
    width: 400,
    height: 250,
    config: { xField: 'x', yField: 'y', label: { position: 'top' } },
  },

  // Row 3: Scatter + Pie
  {
    id: 'chartRow3',
    type: 'Row',
    gutter: 16,
    children: ['chartScatterCard', 'chartPieCard'],
  },
  {
    id: 'chartScatterCard',
    type: 'Card',
    title: '🔵 Scatter 散点图',
    style: { marginBottom: 16 },
    children: ['chartScatter'],
  },
  {
    id: 'chartScatter',
    type: 'Chart',
    chartType: 'scatter',
    data: [
      { x: 10, y: 20 }, { x: 15, y: 35 }, { x: 25, y: 25 }, { x: 30, y: 45 },
      { x: 40, y: 30 }, { x: 50, y: 55 }, { x: 60, y: 40 }, { x: 70, y: 65 },
      { x: 80, y: 50 }, { x: 90, y: 75 },
    ],
    width: 400,
    height: 250,
    config: { xField: 'x', yField: 'y' },
  },
  {
    id: 'chartPieCard',
    type: 'Card',
    title: '🥧 Pie 饼图',
    style: { marginBottom: 16 },
    children: ['chartPie'],
  },
  {
    id: 'chartPie',
    type: 'Chart',
    chartType: 'pie',
    data: [
      { type: '直接访问', value: 35 }, { type: '邮件营销', value: 25 },
      { type: '联盟广告', value: 20 }, { type: '视频广告', value: 15 },
      { type: '搜索引擎', value: 5 },
    ],
    width: 400,
    height: 250,
    config: { angleField: 'value', colorField: 'type' },
  },

  // Row 4: Donut + Radar
  {
    id: 'chartRow4',
    type: 'Row',
    gutter: 16,
    children: ['chartDonutCard', 'chartRadarCard'],
  },
  {
    id: 'chartDonutCard',
    type: 'Card',
    title: '🍩 Donut 环形图',
    style: { marginBottom: 16 },
    children: ['chartDonut'],
  },
  {
    id: 'chartDonut',
    type: 'Chart',
    chartType: 'donut',
    data: [
      { type: '直接访问', value: 35 }, { type: '邮件营销', value: 25 },
      { type: '联盟广告', value: 20 }, { type: '视频广告', value: 15 },
      { type: '搜索引擎', value: 5 },
    ],
    width: 400,
    height: 250,
    config: { angleField: 'value', colorField: 'type' },
  },
  {
    id: 'chartRadarCard',
    type: 'Card',
    title: '🕸️ Radar 雷达图',
    style: { marginBottom: 16 },
    children: ['chartRadar'],
  },
  {
    id: 'chartRadar',
    type: 'Chart',
    chartType: 'radar',
    data: [
      { name: '速度', value: 80 }, { name: '力量', value: 65 },
      { name: '技巧', value: 90 }, { name: '防守', value: 70 },
      { name: '体能', value: 85 }, { name: '心理', value: 75 },
    ],
    width: 400,
    height: 250,
    config: { xField: 'name', yField: 'value' },
  },

  // Row 5: Gauge + Rose
  {
    id: 'chartRow5',
    type: 'Row',
    gutter: 16,
    children: ['chartGaugeCard', 'chartRoseCard'],
  },
  {
    id: 'chartGaugeCard',
    type: 'Card',
    title: '⏱️ Gauge 仪表盘',
    style: { marginBottom: 16 },
    children: ['chartGauge'],
  },
  {
    id: 'chartGauge',
    type: 'Chart',
    chartType: 'gauge',
    data: [],
    width: 400,
    height: 250,
    config: { percent: 0.75 },
  },
  {
    id: 'chartRoseCard',
    type: 'Card',
    title: '🌹 Rose 玫瑰图',
    style: { marginBottom: 16 },
    children: ['chartRose'],
  },
  {
    id: 'chartRose',
    type: 'Chart',
    chartType: 'rose',
    data: [
      { type: '分类一', value: 27 }, { type: '分类二', value: 25 },
      { type: '分类三', value: 18 }, { type: '分类四', value: 15 },
      { type: '分类五', value: 10 }, { type: '其他', value: 5 },
    ],
    width: 400,
    height: 250,
    config: { xField: 'type', yField: 'value' },
  },

  // Row 6: Funnel + Heatmap
  {
    id: 'chartRow6',
    type: 'Row',
    gutter: 16,
    children: ['chartFunnelCard', 'chartHeatmapCard'],
  },
  {
    id: 'chartFunnelCard',
    type: 'Card',
    title: '🔻 Funnel 漏斗图',
    style: { marginBottom: 16 },
    children: ['chartFunnel'],
  },
  {
    id: 'chartFunnel',
    type: 'Chart',
    chartType: 'funnel',
    data: [
      { x: '访问', y: 100 }, { x: '咨询', y: 80 }, { x: '订单', y: 60 },
      { x: '点击', y: 40 }, { x: '成交', y: 20 },
    ],
    width: 400,
    height: 250,
    config: { xField: 'x', yField: 'y' },
  },
  {
    id: 'chartHeatmapCard',
    type: 'Card',
    title: '🔥 Heatmap 热力图',
    style: { marginBottom: 16 },
    children: ['chartHeatmap'],
  },
  {
    id: 'chartHeatmap',
    type: 'Chart',
    chartType: 'heatmap',
    data: [
      { x: 'A', y: '周一', value: 10 }, { x: 'B', y: '周一', value: 20 }, { x: 'C', y: '周一', value: 30 },
      { x: 'A', y: '周二', value: 15 }, { x: 'B', y: '周二', value: 25 }, { x: 'C', y: '周二', value: 35 },
      { x: 'A', y: '周三', value: 20 }, { x: 'B', y: '周三', value: 30 }, { x: 'C', y: '周三', value: 40 },
    ],
    width: 400,
    height: 250,
    config: { xField: 'x', yField: 'y', colorField: 'value' },
  },

  // Row 7: Treemap + WordCloud
  {
    id: 'chartRow7',
    type: 'Row',
    gutter: 16,
    children: ['chartTreemapCard', 'chartWordCloudCard'],
  },
  {
    id: 'chartTreemapCard',
    type: 'Card',
    title: '🌳 Treemap 矩形树图',
    style: { marginBottom: 16 },
    children: ['chartTreemap'],
  },
  {
    id: 'chartTreemap',
    type: 'Chart',
    chartType: 'treemap',
    data: {
      name: 'root',
      children: [
        { name: '分类A', value: 10 },
        { name: '分类B', value: 20 },
        { name: '分类C', value: 15 },
        { name: '分类D', value: 25 },
        { name: '分类E', value: 30 },
      ],
    },
    width: 400,
    height: 250,
    config: {},
  },
  {
    id: 'chartWordCloudCard',
    type: 'Card',
    title: '☁️ WordCloud 词云',
    style: { marginBottom: 16 },
    children: ['chartWordCloud'],
  },
  {
    id: 'chartWordCloud',
    type: 'Chart',
    chartType: 'wordCloud',
    data: [
      { word: 'AGenUI', weight: 10 }, { word: 'A2UI', weight: 8 },
      { word: 'Web', weight: 7 }, { word: 'Android', weight: 6 },
      { word: 'iOS', weight: 6 }, { word: 'HarmonyOS', weight: 5 },
      { word: 'WASM', weight: 5 }, { word: 'React', weight: 4 },
      { word: '跨平台', weight: 4 }, { word: '渲染', weight: 3 },
    ],
    width: 400,
    height: 250,
    config: { wordField: 'word', weightField: 'weight' },
  },

  // Row 8: Bar Grouped
  {
    id: 'chartRow8',
    type: 'Row',
    gutter: 16,
    children: ['chartGroupedCard'],
  },
  {
    id: 'chartGroupedCard',
    type: 'Card',
    title: '📊 Bar Grouped 分组柱状图',
    style: { marginBottom: 16 },
    children: ['chartGrouped'],
  },
  {
    id: 'chartGrouped',
    type: 'Chart',
    chartType: 'bar',
    data: [
      { type: '一月', value: 65, group: '去年' },
      { type: '二月', value: 85, group: '去年' },
      { type: '三月', value: 45, group: '去年' },
      { type: '一月', value: 70, group: '今年' },
      { type: '二月', value: 90, group: '今年' },
      { type: '三月', value: 55, group: '今年' },
    ],
    width: 400,
    height: 250,
    config: { xField: 'type', yField: 'value', seriesField: 'group', isGroup: true },
  },
];

export const ComponentShowcase: React.FC = () => {
  const [surfaceManager, setSurfaceManager] = useState<SurfaceManager | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let sm: SurfaceManager | null = null;

    const init = async () => {
      try {
        await AGenUI.initialize();
        sm = new SurfaceManager();
        await sm.initialize();

        const engine = sm.getEngine();
        engine.createSurface('showcase-surface', 'urn:a2ui:catalog:agenui_catalog', {
          themeId: 'default',
        });
        engine.updateComponents(
          'showcase-surface',
          demoComponents.map((c) => JSON.stringify(c))
        );

        setSurfaceManager(sm);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    };

    init();
    return () => {
      sm?.destroy();
    };
  }, []);

  const handleAction = React.useCallback(
    (action: unknown) => {
      const a = action as { sourceComponentId?: string; context?: Record<string, unknown> };
      const engine = surfaceManager?.getEngine();
      if (!engine) return;

      if (a.sourceComponentId === 'modalTriggerBtn') {
        engine.updateComponent(
          'showcase-surface',
          JSON.stringify({ id: 'modal1', type: 'Modal', title: 'Demo Modal', open: true, footer: 'default', children: ['modalText'] })
        );
      }

      if (a.sourceComponentId === 'modal1') {
        engine.updateComponent(
          'showcase-surface',
          JSON.stringify({ id: 'modal1', type: 'Modal', title: 'Demo Modal', open: false, footer: 'default', children: ['modalText'] })
        );
      }

      if (a.sourceComponentId === 'basicBtnPrimary') {
        engine.updateComponent(
          'showcase-surface',
          JSON.stringify({ id: 'btnFeedback', type: 'Text', text: '✅ Primary 按钮已点击', style: { color: '#52c41a', textAlign: 'center' } })
        );
      }

      if (a.sourceComponentId === 'basicBtnDanger') {
        engine.updateComponent(
          'showcase-surface',
          JSON.stringify({ id: 'btnFeedback', type: 'Text', text: '⚠️ Danger 按钮已点击', style: { color: '#ff4d4f', textAlign: 'center' } })
        );
      }
    },
    [surfaceManager]
  );

  if (error) {
    return (
      <div style={{ color: 'red', padding: 24 }}>
        Error: {error}
      </div>
    );
  }

  if (!surfaceManager) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <AGenUISurface
        surfaceManager={surfaceManager}
        onAction={handleAction}
      />
    </Space>
  );
};
