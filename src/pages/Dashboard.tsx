import React from 'react';
import { Card, Row, Col, Tabs } from 'antd';
import { LineChart, BarChart, Progress } from '@ant-design/charts';
import { CountdownList } from '../components/CountdownList';
import { StatisticCards } from '../components/StatisticCards';
import { weeklyReportConfig, monthlyReportConfig } from '../config/chartConfig';

const { TabPane } = Tabs;

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <h1>事件分析平台 (STM)</h1>
      
      {/* KPI 統計卡片區 */}
      <StatisticCards />
      
      {/* 圖表區域 */}
      <Row gutter={[16, 16]} className="chart-section">
        <Col span={12}>
          <Card title="近一週通報總數">
            <LineChart {...weeklyReportConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="近一月通報總數">
            <BarChart {...monthlyReportConfig} />
          </Card>
        </Col>
      </Row>
      
      {/* Tab區域 */}
      <Tabs defaultActiveKey="1" className="dashboard-tabs">
        <TabPane tab="倒數中電表清單" key="1">
          <CountdownList />
        </TabPane>
        <TabPane tab="其他分析" key="2">
          其他分析內容
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Dashboard; 