'use client';

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, BarChartOutlined, CalendarOutlined } from '@ant-design/icons';

export const StatisticCards: React.FC = () => {
  return (
    <Row gutter={[24, 24]} className="statistic-cards">
      <Col span={6}>
        <Card bordered={false} className="statistic-card">
          <Statistic 
            title="準備發送總數" 
            value={28} 
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#1677ff' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false} className="statistic-card">
          <Statistic 
            title="本日已發送" 
            value={156}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false} className="statistic-card">
          <Statistic 
            title="本週已發送" 
            value={892}
            prefix={<BarChartOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
      <Col span={6}>
        <Card bordered={false} className="statistic-card">
          <Statistic 
            title="本月已發送" 
            value={3254}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: '#eb2f96' }}
          />
        </Card>
      </Col>
    </Row>
  );
}; 