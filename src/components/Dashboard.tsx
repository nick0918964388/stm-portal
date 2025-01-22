'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Tabs, Typography, Radio, DatePicker } from 'antd';
import { CountdownList } from './CountdownList';
import { StatisticCards } from './StatisticCards';
import {
  LineChart,
  Line as RechartsLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [customDateRange, setCustomDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const { RangePicker } = DatePicker;

  // 圖表範例資料
  const allData = {
    week: [
      { date: '2024-01-15', count: 35 },
      { date: '2024-01-16', count: 42 },
      { date: '2024-01-17', count: 28 },
      { date: '2024-01-18', count: 45 },
      { date: '2024-01-19', count: 38 },
      { date: '2024-01-20', count: 25 },
      { date: '2024-01-21', count: 31 },
    ],
    month: [
      { date: '2024-01-01', count: 180 },
      { date: '2024-01-08', count: 156 },
      { date: '2024-01-15', count: 198 },
      { date: '2024-01-22', count: 167 },
    ],
    year: [
      { date: '2023-02', count: 580 },
      { date: '2023-03', count: 620 },
      { date: '2023-04', count: 750 },
      { date: '2023-05', count: 680 },
      { date: '2023-06', count: 890 },
      { date: '2023-07', count: 820 },
      { date: '2023-08', count: 950 },
      { date: '2023-09', count: 880 },
      { date: '2023-10', count: 920 },
      { date: '2023-11', count: 850 },
      { date: '2023-12', count: 780 },
      { date: '2024-01', count: 850 },
    ],
  };

  const filterDataByDateRange = (data: any[], range: [dayjs.Dayjs, dayjs.Dayjs]) => {
    return data.filter(item => {
      const itemDate = dayjs(item.date);
      return itemDate.isSame(range[0], 'day') || 
             itemDate.isSame(range[1], 'day') ||
             (itemDate.isAfter(range[0], 'day') && itemDate.isBefore(range[1], 'day'));
    });
  };

  const getCurrentData = () => {
    if (customDateRange) {
      // 使用所有數據進行篩選
      const allDataFlat = [
        ...allData.week,
        ...allData.month,
        ...allData.year,
      ].filter((item, index, self) => 
        index === self.findIndex((t) => t.date === item.date)
      ).sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
      
      return filterDataByDateRange(allDataFlat, customDateRange);
    }
    return allData[timeRange];
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setCustomDateRange([dates[0], dates[1]]);
      setTimeRange('custom');
    } else {
      setCustomDateRange(null);
      setTimeRange('week');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (timeRange === 'year') {
      return `${date.getMonth() + 1}月`;
    } else if (timeRange === 'week') {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
    return dateStr;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedDate = timeRange === 'year'
        ? `${date.getFullYear()}年${date.getMonth() + 1}月`
        : `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{formattedDate}</p>
          <p className="tooltip-value">通報數量: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const DashboardContent = () => (
    <>
      <StatisticCards />
      <Row gutter={[24, 24]} className="chart-section">
        <Col span={24}>
          <Card 
            title="通報趨勢分析"
            className="chart-card"
            bordered={false}
            extra={
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Radio.Group 
                  value={timeRange} 
                  onChange={(e) => {
                    setTimeRange(e.target.value);
                    if (e.target.value !== 'custom') {
                      setCustomDateRange(null);
                    }
                  }}
                >
                  <Radio.Button value="week">週</Radio.Button>
                  <Radio.Button value="month">月</Radio.Button>
                  <Radio.Button value="year">年</Radio.Button>
                </Radio.Group>
                <RangePicker 
                  onChange={handleDateRangeChange}
                  value={customDateRange}
                />
              </div>
            }
          >
            <div style={{ width: '100%', height: '350px' }}>
              <ResponsiveContainer>
                <LineChart
                  data={getCurrentData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fontSize: 14 }}
                    stroke="#666"
                  />
                  <YAxis
                    tick={{ fontSize: 14 }}
                    stroke="#666"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <RechartsLine
                    type="monotone"
                    dataKey="count"
                    stroke="#1890ff"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#1890ff' }}
                    activeDot={{ r: 6, fill: '#1890ff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );

  const mainTabItems = [
    {
      key: '1',
      label: '事件總覽',
      children: <DashboardContent />
    },
    {
      key: '2',
      label: '倒數監控',
      children: <CountdownList />
    },
    {
      key: '3',
      label: '事件查詢',
      children: '事件查詢內容'
    },
    {
      key: '4',
      label: '系統設定',
      children: '系統設定內容'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="site-header">
        <Title level={3}>事件分析平台 (STM)</Title>
      </div>
      <Tabs 
        defaultActiveKey="1" 
        items={mainTabItems}
        className="main-tabs"
        size="large"
      />
    </div>
  );
};

export default Dashboard; 