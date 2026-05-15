import React, { useEffect, useRef } from 'react';
import {
  Bar, Line, Area, Column, Scatter, Pie, Radar, Gauge,
  Rose, Funnel, Heatmap, Treemap, WordCloud,
} from '@antv/g2plot';
import type { AGenUIComponentProps } from '../types';

type ChartType =
  | 'bar'
  | 'line'
  | 'area'
  | 'column'
  | 'scatter'
  | 'pie'
  | 'donut'
  | 'radar'
  | 'gauge'
  | 'rose'
  | 'funnel'
  | 'heatmap'
  | 'treemap'
  | 'wordCloud'
  | 'bar_grouped';

type ChartInstance =
  | Bar
  | Line
  | Area
  | Column
  | Scatter
  | Pie
  | Radar
  | Gauge
  | Rose
  | Funnel
  | Heatmap
  | Treemap
  | WordCloud;

export const Chart: React.FC<AGenUIComponentProps> = ({ properties }) => {
  const { chartType, data, config, width, height, style } = properties;
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const type = (chartType as ChartType) || 'bar';
    const chartData = (data as Array<Record<string, unknown>>) || [];
    const chartConfig = (config as Record<string, unknown>) || {};

    chartRef.current?.destroy();

    const commonConfig = {
      data: chartData,
      width: (width as number) || 400,
      height: (height as number) || 300,
      ...chartConfig,
    };

    let chart: ChartInstance;

    switch (type) {
      case 'line': {
        chart = new Line(containerRef.current, {
          ...commonConfig,
          xField: (chartConfig.xField as string) || 'x',
          yField: (chartConfig.yField as string) || 'y',
        });
        break;
      }
      case 'area': {
        chart = new Area(containerRef.current, {
          ...commonConfig,
          xField: (chartConfig.xField as string) || 'x',
          yField: (chartConfig.yField as string) || 'y',
        });
        break;
      }
      case 'column': {
        chart = new Column(containerRef.current, {
          ...commonConfig,
          xField: (chartConfig.xField as string) || 'x',
          yField: (chartConfig.yField as string) || 'y',
        });
        break;
      }
      case 'scatter': {
        chart = new Scatter(containerRef.current, {
          ...commonConfig,
          xField: (chartConfig.xField as string) || 'x',
          yField: (chartConfig.yField as string) || 'y',
        });
        break;
      }
      case 'pie': {
        chart = new Pie(containerRef.current, {
          ...commonConfig,
          angleField: (chartConfig.angleField as string) || 'value',
          colorField: (chartConfig.colorField as string) || 'type',
        });
        break;
      }
      case 'donut': {
        chart = new Pie(containerRef.current, {
          ...commonConfig,
          angleField: (chartConfig.angleField as string) || 'value',
          colorField: (chartConfig.colorField as string) || 'type',
          innerRadius: 0.6,
        });
        break;
      }
      case 'radar': {
        chart = new Radar(containerRef.current, {
          ...commonConfig,
          xField: (chartConfig.xField as string) || 'name',
          yField: (chartConfig.yField as string) || 'value',
        });
        break;
      }
      case 'gauge': {
        chart = new Gauge(containerRef.current, {
          percent: (chartConfig.percent as number) || 0,
          ...chartConfig,
          width: (width as number) || 400,
          height: (height as number) || 300,
        });
        break;
      }
      case 'rose': {
        chart = new Rose(containerRef.current, {
          ...commonConfig,
          xField: (chartConfig.xField as string) || 'type',
          yField: (chartConfig.yField as string) || 'value',
        });
        break;
      }
      case 'funnel': {
        chart = new Funnel(containerRef.current, {
          ...commonConfig,
          xField: (chartConfig.xField as string) || 'x',
          yField: (chartConfig.yField as string) || 'y',
        });
        break;
      }
      case 'heatmap': {
        chart = new Heatmap(containerRef.current, {
          ...commonConfig,
          xField: (chartConfig.xField as string) || 'x',
          yField: (chartConfig.yField as string) || 'y',
          colorField: (chartConfig.colorField as string) || 'value',
        });
        break;
      }
      case 'treemap': {
        chart = new Treemap(containerRef.current, {
          ...commonConfig,
        });
        break;
      }
      case 'wordCloud': {
        chart = new WordCloud(containerRef.current, {
          ...commonConfig,
          wordField: (chartConfig.wordField as string) || 'word',
          weightField: (chartConfig.weightField as string) || 'weight',
        });
        break;
      }
      default: {
        chart = new Bar(containerRef.current, {
          ...commonConfig,
          xField: (chartConfig.xField as string) || 'x',
          yField: (chartConfig.yField as string) || 'y',
        });
      }
    }

    chart.render();
    chartRef.current = chart;

    return () => {
      chart.destroy();
      chartRef.current = null;
    };
  }, [chartType, data, config, width, height]);

  return (
    <div
      ref={containerRef}
      style={{
        width: (width as number) || 400,
        height: (height as number) || 300,
        ...style as React.CSSProperties,
      }}
    />
  );
};
