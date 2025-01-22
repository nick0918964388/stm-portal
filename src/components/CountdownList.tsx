'use client';

import React, { useState, useEffect } from 'react';
import { Table, Progress, Card, Timeline, Tag, Space, Select, Tabs, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ClockCircleOutlined, DownOutlined, RightOutlined, CodeOutlined } from '@ant-design/icons';

// 事件類型定義
export enum EventType {
  POWER_OFF = 'POWER_OFF',
  POWER_ON = 'POWER_ON',
  LAST_GASP = 'LAST_GASP',
  LOW_VOLTAGE = 'LOW_VOLTAGE',
  LOW_CURRENT = 'LOW_CURRENT',
  COVER_OPEN = 'COVER_OPEN',
  PING_FAILED = 'PING_FAILED',
  REPORT_SENT = 'REPORT_SENT',
}

// 事件類型配置
const eventConfig = {
  [EventType.POWER_OFF]: { color: 'red', label: '停電' },
  [EventType.POWER_ON]: { color: 'green', label: '復電' },
  [EventType.LAST_GASP]: { color: 'orange', label: 'Last Gasp' },
  [EventType.LOW_VOLTAGE]: { color: 'gold', label: '電壓過低' },
  [EventType.LOW_CURRENT]: { color: 'lime', label: '電流過低' },
  [EventType.COVER_OPEN]: { color: 'purple', label: '開蓋' },
  [EventType.PING_FAILED]: { color: 'cyan', label: 'Ping 失敗' },
  [EventType.REPORT_SENT]: { color: 'blue', label: '通報完成' },
};

// 預設事件組合
const eventGroups = {
  powerEvents: {
    label: '停復電事件',
    types: [EventType.POWER_OFF, EventType.POWER_ON, EventType.PING_FAILED],
  },
  voltageEvents: {
    label: '電壓相關',
    types: [EventType.LOW_VOLTAGE, EventType.LAST_GASP],
  },
  currentEvents: {
    label: '電流相關',
    types: [EventType.LOW_CURRENT],
  },
  maintenanceEvents: {
    label: '維護事件',
    types: [EventType.COVER_OPEN],
  },
};

interface TimelineEvent {
  time: string;
  event: string;
  type: EventType;
  details?: {
    response?: string;
    status?: number;
    error?: string;
  };
}

interface MeterData {
  id: string;
  meterNo: string;
  district: string;
  eventTime: string;
  powerOffTime: string;
  powerOnTime: string;
  remainingTime: number;
  timeline: TimelineEvent[];
}

interface GroupedTimelineEvent {
  time: string;
  events: TimelineEvent[];
  isExpanded?: boolean;
}

export const CountdownList: React.FC = () => {
  const [selectedEventTypes, setSelectedEventTypes] = useState<EventType[]>(eventGroups.powerEvents.types);
  const [activeTab, setActiveTab] = useState('counting');
  const [expandedTimes, setExpandedTimes] = useState<Set<string>>(new Set());
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  const [meterFilter, setMeterFilter] = useState('');
  const [data, setData] = useState<MeterData[]>([
    {
      id: '1',
      meterNo: 'GD12345678',
      district: '01',
      eventTime: '2024-01-22 10:30:00',
      powerOffTime: '2024-01-22 10:30:00',
      powerOnTime: '2024-01-22 11:45:00',
      remainingTime: 300,
      timeline: [
        { time: '2024-01-22 10:30:00', event: '停電事件', type: EventType.POWER_OFF },
        { time: '2024-01-22 10:30:00', event: '停電事件', type: EventType.POWER_OFF },
        { time: '2024-01-22 10:30:00', event: '停電事件', type: EventType.POWER_OFF },
        { time: '2024-01-22 10:30:01', event: '停電事件', type: EventType.POWER_OFF },
        { time: '2024-01-22 10:30:05', event: 'Last Gasp 訊號', type: EventType.LAST_GASP },
        { time: '2024-01-22 10:30:05', event: 'Last Gasp 訊號', type: EventType.LAST_GASP },
        { time: '2024-01-22 10:30:05', event: 'Last Gasp 訊號', type: EventType.LAST_GASP },
        { time: '2024-01-22 10:30:05', event: 'Last Gasp 訊號', type: EventType.LAST_GASP },
        { 
          time: '2024-01-22 10:35:00', 
          event: 'Ping 失敗', 
          type: EventType.PING_FAILED,
          details: {
            status: 404,
            error: 'Connection timeout',
            response: JSON.stringify({
              error: 'timeout',
              message: 'Connection timeout after 5000ms',
              timestamp: '2024-01-22T10:35:00.123Z',
              requestId: 'ping-123456',
              target: 'meter-GD12345678'
            }, null, 2)
          }
        },
        { time: '2024-01-22 10:40:00', event: '通報完成', type: EventType.REPORT_SENT },
        { time: '2024-01-22 11:45:00', event: '復電完成', type: EventType.POWER_ON },
      ],
    },
    {
      id: '2',
      meterNo: 'GD87654321',
      district: '03',
      eventTime: '2024-01-22 10:32:00',
      powerOffTime: '2024-01-22 10:32:00',
      powerOnTime: '2024-01-22 11:50:00',
      remainingTime: 0, // 已完成
      timeline: [
        { time: '2024-01-22 10:32:00', event: '電壓過低警告', type: EventType.LOW_VOLTAGE },
        { time: '2024-01-22 10:32:30', event: '停電事件', type: EventType.POWER_OFF },
        { time: '2024-01-22 10:33:00', event: 'Last Gasp 訊號', type: EventType.LAST_GASP },
        { time: '2024-01-22 10:36:00', event: 'Ping 失敗', type: EventType.PING_FAILED },
        { time: '2024-01-22 10:41:00', event: '通報完成', type: EventType.REPORT_SENT },
        { time: '2024-01-22 11:50:00', event: '復電完成', type: EventType.POWER_ON },
      ],
    },
  ]);

  // 定義不同的表格欄位
  const countingColumns: ColumnsType<MeterData> = [
    {
      title: '電表編號',
      dataIndex: 'meterNo',
      key: 'meterNo',
      width: 150,
    },
    {
      title: '區處',
      dataIndex: 'district',
      key: 'district',
      width: 100,
    },
    {
      title: '停電時間',
      dataIndex: 'powerOffTime',
      key: 'powerOffTime',
      width: 180,
    },
    {
      title: '復電時間',
      dataIndex: 'powerOnTime',
      key: 'powerOnTime',
      width: 180,
    },
    {
      title: '剩餘時間',
      key: 'remainingTime',
      width: 200,
      render: (_, record) => (
        <Progress 
          percent={Math.min(100, (record.remainingTime / 600) * 100)} 
          format={percent => `${Math.floor(record.remainingTime / 60)}:${String(record.remainingTime % 60).padStart(2, '0')}`}
          status={record.remainingTime < 120 ? 'exception' : 'active'}
          strokeColor={{
            from: '#108ee9',
            to: '#87d068',
          }}
        />
      ),
    },
  ];

  const reportedColumns: ColumnsType<MeterData> = countingColumns.filter(col => col.key !== 'remainingTime');

  useEffect(() => {
    const timer = setInterval(() => {
      setData(prevData => 
        prevData.map(item => ({
          ...item,
          remainingTime: Math.max(0, item.remainingTime - 1)
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getFilteredTimeline = (timeline: TimelineEvent[]) => {
    if (selectedEventTypes.length === 0) return timeline;
    return timeline.filter(event => selectedEventTypes.includes(event.type));
  };

  const handleEventGroupSelect = (group: keyof typeof eventGroups) => {
    setSelectedEventTypes(eventGroups[group].types);
  };

  const groupTimelineEvents = (timeline: TimelineEvent[]): GroupedTimelineEvent[] => {
    const groupedEvents = timeline.reduce((groups: { [key: string]: TimelineEvent[] }, event) => {
      if (!groups[event.time]) {
        groups[event.time] = [];
      }
      groups[event.time].push(event);
      return groups;
    }, {});

    return Object.entries(groupedEvents).map(([time, events]) => ({
      time,
      events,
    }));
  };

  const toggleTimeExpand = (time: string) => {
    setExpandedTimes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(time)) {
        newSet.delete(time);
      } else {
        newSet.add(time);
      }
      return newSet;
    });
  };

  const toggleDetails = (eventTime: string, eventIndex: number) => {
    const detailKey = `${eventTime}-${eventIndex}`;
    setExpandedDetails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(detailKey)) {
        newSet.delete(detailKey);
      } else {
        newSet.add(detailKey);
      }
      return newSet;
    });
  };

  // 格式化時間函數
  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  };

  const renderEventContent = (event: TimelineEvent, index: number) => {
    const detailKey = `${event.time}-${index}`;
    const isDetailExpanded = expandedDetails.has(detailKey);
    const isPingEvent = event.type === EventType.PING_FAILED;
    
    return (
      <div key={index} className="timeline-event-wrapper">
        <div className="timeline-event-main">
          <Tag color={eventConfig[event.type].color} className="timeline-event-tag">
            {eventConfig[event.type].label}
          </Tag>
          <span className="timeline-event-text">{event.event}</span>
          {isPingEvent && event.details && (
            <Tag 
              icon={<CodeOutlined />}
              color="default"
              className="timeline-detail-trigger"
              onClick={(e) => {
                e.stopPropagation();
                toggleDetails(event.time, index);
              }}
            >
              {isDetailExpanded ? '收合詳情' : '查看詳情'}
            </Tag>
          )}
        </div>
        {isPingEvent && event.details && isDetailExpanded && (
          <div className="timeline-event-details">
            <div className="details-header">
              <Tag color={event.details.status === 200 ? 'success' : 'error'}>
                Status: {event.details.status}
              </Tag>
              {event.details.error && (
                <Tag color="error">Error: {event.details.error}</Tag>
              )}
            </div>
            <pre className="details-json">
              {event.details.response}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const expandedRowRender = (record: MeterData) => {
    const filteredTimeline = getFilteredTimeline(record.timeline);
    const groupedTimeline = groupTimelineEvents(filteredTimeline);
    
    return (
      <Card className="timeline-card">
        <div className="timeline-filters">
          <div className="timeline-tags">
            {Object.entries(eventGroups).map(([key, group]) => (
              <Tag
                key={key}
                color={JSON.stringify(selectedEventTypes) === JSON.stringify(group.types) ? 'blue' : 'default'}
                className="event-group-tag"
                onClick={() => handleEventGroupSelect(key as keyof typeof eventGroups)}
              >
                {group.label}
              </Tag>
            ))}
          </div>
          <Select
            mode="multiple"
            style={{ width: '100%', marginTop: 8 }}
            placeholder="選擇要顯示的事件類型"
            onChange={(values) => setSelectedEventTypes(values as EventType[])}
            value={selectedEventTypes}
          >
            {Object.entries(eventConfig).map(([key, value]) => (
              <Select.Option key={key} value={key}>
                <Tag color={value.color}>{value.label}</Tag>
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="timeline-container">
          <Timeline
            mode="left"
            items={groupedTimeline.map(group => {
              const time = new Date(group.time);
              const isExpanded = expandedTimes.has(group.time);
              const visibleEvents = isExpanded ? group.events : [group.events[0]];
              const hasMoreEvents = group.events.length > 1;

              return {
                label: (
                  <div className="timeline-time">
                    {formatDateTime(time)}
                  </div>
                ),
                children: (
                  <div className="timeline-content">
                    {visibleEvents.map((event, index) => renderEventContent(event, index))}
                    {hasMoreEvents && (
                      <div 
                        className="timeline-expand-button"
                        onClick={() => toggleTimeExpand(group.time)}
                      >
                        {isExpanded ? (
                          <span><DownOutlined /> 收合 {group.events.length} 個事件</span>
                        ) : (
                          <span><RightOutlined /> 展開更多 {group.events.length - 1} 個事件</span>
                        )}
                      </div>
                    )}
                  </div>
                ),
                dot: (
                  <div className={`timeline-dot timeline-dot-${eventConfig[group.events[0].type].color}`}>
                    <ClockCircleOutlined style={{ fontSize: '16px' }} />
                  </div>
                ),
              };
            })}
          />
        </div>
      </Card>
    );
  };

  // 過濾資料的邏輯
  const getFilteredData = () => {
    let filteredData = data.filter(item => 
      meterFilter ? item.meterNo.toLowerCase().includes(meterFilter.toLowerCase()) : true
    );

    switch (activeTab) {
      case 'counting':
        return filteredData.filter(item => item.remainingTime > 0);
      case 'reported':
        return filteredData.filter(item => 
          item.timeline.some(event => event.type === EventType.REPORT_SENT)
        );
      case 'unreported':
        return filteredData.filter(item => 
          !item.timeline.some(event => event.type === EventType.REPORT_SENT)
        );
      default:
        return [];
    }
  };

  // 根據不同的標籤頁選擇要使用的欄位
  const getColumns = () => {
    return activeTab === 'counting' ? countingColumns : reportedColumns;
  };

  return (
    <div className="countdown-list">
      <div className="timeline-filters">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input.Search
            placeholder="搜尋表號"
            allowClear
            onChange={e => setMeterFilter(e.target.value)}
            style={{ width: 200 }}
          />
          <div className="timeline-tags">
            {Object.entries(eventGroups).map(([key, group]) => (
              <Tag
                key={key}
                className="event-group-tag"
                color={selectedEventTypes.some(type => group.types.includes(type)) ? 'blue' : 'default'}
                onClick={() => handleEventGroupSelect(key as keyof typeof eventGroups)}
              >
                {group.label}
              </Tag>
            ))}
          </div>
        </Space>
      </div>

      <Card bordered={false} className="list-card">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane tab="倒數中" key="counting">
            <Table
              columns={getColumns()}
              dataSource={getFilteredData()}
              expandable={{
                expandedRowRender: expandedRowRender,
              }}
              rowKey="id"
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="已通報" key="reported">
            <Table
              columns={getColumns()}
              dataSource={getFilteredData()}
              expandable={{
                expandedRowRender: expandedRowRender,
              }}
              rowKey="id"
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="未通報" key="unreported">
            <Table
              columns={getColumns()}
              dataSource={getFilteredData()}
              expandable={{
                expandedRowRender: expandedRowRender,
              }}
              rowKey="id"
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
}; 