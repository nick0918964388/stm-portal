export const weeklyReportConfig = {
  data: [], // 這裡之後會從API獲取數據
  xField: 'date',
  yField: 'count',
  smooth: true,
  meta: {
    count: {
      alias: '通報數量',
    },
    date: {
      alias: '日期',
    },
  },
};

export const monthlyReportConfig = {
  data: [], // 這裡之後會從API獲取數據
  xField: 'date',
  yField: 'count',
  meta: {
    count: {
      alias: '通報數量',
    },
    date: {
      alias: '日期',
    },
  },
}; 