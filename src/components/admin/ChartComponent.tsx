import React, { useEffect, useRef } from 'react';

interface Dataset {
  label?: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string | string[];
  tension?: number;
}

interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

interface ChartComponentProps {
  data: ChartData;
  type: 'line' | 'bar' | 'doughnut' | 'pie';
  options?: any;
}

export function ChartComponent({ data, type, options = {} }: ChartComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Simple canvas-based chart implementation
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const { width, height } = canvas;
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    if (type === 'line' && data.datasets.length > 0) {
      drawLineChart(ctx, data, chartWidth, chartHeight, padding);
    } else if (type === 'doughnut' && data.datasets.length > 0) {
      drawDoughnutChart(ctx, data, Math.min(chartWidth, chartHeight) / 2, width / 2, height / 2);
    } else if (type === 'bar' && data.datasets.length > 0) {
      drawBarChart(ctx, data, chartWidth, chartHeight, padding);
    }

  }, [data, type]);

  const drawLineChart = (ctx: CanvasRenderingContext2D, chartData: ChartData, width: number, height: number, padding: number) => {
    const dataset = chartData.datasets[0];
    const points = dataset.data;
    const labels = chartData.labels;
    
    if (points.length === 0) return;

    const maxValue = Math.max(...points);
    const minValue = Math.min(...points);
    const valueRange = maxValue - minValue || 1;
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + width, y);
      ctx.stroke();
    }
    
    // Vertical grid lines
    for (let i = 0; i <= points.length - 1; i++) {
      const x = padding + (width / (points.length - 1)) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + height);
      ctx.stroke();
    }
    
    // Draw line
    ctx.strokeStyle = dataset.borderColor || '#3b82f6';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    points.forEach((point, index) => {
      const x = padding + (width / (points.length - 1)) * index;
      const y = padding + height - ((point - minValue) / valueRange) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = dataset.borderColor || '#3b82f6';
    points.forEach((point, index) => {
      const x = padding + (width / (points.length - 1)) * index;
      const y = padding + height - ((point - minValue) / valueRange) * height;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    labels.forEach((label, index) => {
      const x = padding + (width / (points.length - 1)) * index;
      ctx.fillText(label, x, padding + height + 20);
    });
  };

  const drawDoughnutChart = (ctx: CanvasRenderingContext2D, chartData: ChartData, radius: number, centerX: number, centerY: number) => {
    const dataset = chartData.datasets[0];
    const data = dataset.data;
    const total = data.reduce((sum, value) => sum + value, 0);
    const colors = dataset.backgroundColor as string[] || [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
    ];
    
    let currentAngle = -Math.PI / 2;
    
    data.forEach((value, index) => {
      const sliceAngle = (value / total) * Math.PI * 2;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, radius * 0.6, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      
      currentAngle += sliceAngle;
    });
    
    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    
    let legendY = centerY - (chartData.labels.length * 25) / 2;
    chartData.labels.forEach((label, index) => {
      // Draw legend square
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(centerX + radius + 20, legendY - 8, 12, 12);
      
      // Draw label text
      ctx.fillStyle = '#374151';
      ctx.fillText(`${label} (${data[index]})`, centerX + radius + 40, legendY);
      
      legendY += 25;
    });
  };

  const drawBarChart = (ctx: CanvasRenderingContext2D, chartData: ChartData, width: number, height: number, padding: number) => {
    const dataset = chartData.datasets[0];
    const data = dataset.data;
    const maxValue = Math.max(...data);
    
    const barWidth = width / data.length * 0.6;
    const barSpacing = width / data.length * 0.4;
    
    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * height;
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
      const y = padding + height - barHeight;
      
      ctx.fillStyle = dataset.backgroundColor as string || '#3b82f6';
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Draw value on top of bar
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
    });
    
    // Draw labels
    ctx.fillStyle = '#6b7280';
    chartData.labels.forEach((label, index) => {
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2 + barWidth / 2;
      ctx.fillText(label, x, padding + height + 20);
    });
  };

  return (
    <div className="relative w-full h-64">
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="w-full h-full"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
}