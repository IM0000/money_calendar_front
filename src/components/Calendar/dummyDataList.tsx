export interface Dummy {
  time: Date;
  eventClassify: EventClassify;
  event: string;
  importance: string;
  actual: number;
  forecast: number;
  previous: number;
  button: string;
}

export type EconomicIndicator = {
  type: '경제지표';
  announcementDate: Date;
  name: string;
  importance: number;
  actualValue: number;
  predictedValue: number;
  previousValue: number;
  isMySchedule?: boolean; // 내 일정 여부
};

export type Performance = {
  type: '실적';
  announcementDate: Date;
  companyName: string;
  EPS: {
    actual: number;
    predicted: number;
    previous: number;
  };
  revenue: {
    actual: number;
    predicted: number;
    previous: number;
  };
  isMySchedule?: boolean; // 내 일정 여부
};

export type Dividend = {
  type: '배당';
  exDividendDate: Date;
  companyName: string;
  dividend: {
    actual: number;
    previous: number;
  };
  paymentDate: Date;
  isMySchedule?: boolean; // 내 일정 여부
};

export type EventData = EconomicIndicator | Performance | Dividend;

const dummyDataList: EventData[] = [
  {
    type: '경제지표',
    announcementDate: new Date('2024-06-11T09:00:00'),
    name: 'CPI',
    importance: 3,
    actualValue: 3.7,
    predictedValue: 3.6,
    previousValue: 3.5,
    isMySchedule: true, // 내 일정 여부
  },
  {
    type: '경제지표',
    announcementDate: new Date('2024-06-11T09:00:00'),
    name: 'GDP',
    importance: 3,
    actualValue: 2.5,
    predictedValue: 2.6,
    previousValue: 2.4,
    isMySchedule: true, // 내 일정 여부
  },
  {
    type: '경제지표',
    announcementDate: new Date('2024-06-11T09:00:00'),
    name: 'Unemployment Rate',
    importance: 2,
    actualValue: 4.1,
    predictedValue: 4.0,
    previousValue: 3.9,
    isMySchedule: false, // 내 일정 여부
  },
  {
    type: '실적',
    announcementDate: new Date('2024-06-11T09:00:00'),
    companyName: 'Company A',
    EPS: {
      actual: 1.2,
      predicted: 1.1,
      previous: 1.0,
    },
    revenue: {
      actual: 100,
      predicted: 105,
      previous: 95,
    },
    isMySchedule: true, // 내 일정 여부
  },
  {
    type: '실적',
    announcementDate: new Date('2024-06-11T09:00:00'),
    companyName: 'Company B',
    EPS: {
      actual: 2.2,
      predicted: 2.0,
      previous: 2.1,
    },
    revenue: {
      actual: 200,
      predicted: 210,
      previous: 195,
    },
    isMySchedule: false, // 내 일정 여부
  },
  {
    type: '실적',
    announcementDate: new Date('2024-06-11T09:00:00'),
    companyName: 'Company C',
    EPS: {
      actual: 3.2,
      predicted: 3.1,
      previous: 3.0,
    },
    revenue: {
      actual: 300,
      predicted: 310,
      previous: 295,
    },
    isMySchedule: false, // 내 일정 여부
  },
  {
    type: '배당',
    exDividendDate: new Date('2024-06-11T09:00:00'),
    companyName: 'Company X',
    dividend: {
      actual: 1.5,
      previous: 1.4,
    },
    paymentDate: new Date('2024-06-25T09:00:00'),
    isMySchedule: true, // 내 일정 여부
  },
  {
    type: '배당',
    exDividendDate: new Date('2024-06-11T09:00:00'),
    companyName: 'Company Y',
    dividend: {
      actual: 2.5,
      previous: 2.4,
    },
    paymentDate: new Date('2024-06-25T09:00:00'),
    isMySchedule: true, // 내 일정 여부
  },
  {
    type: '배당',
    exDividendDate: new Date('2024-06-11T09:00:00'),
    companyName: 'Company Z',
    dividend: {
      actual: 3.5,
      previous: 3.4,
    },
    paymentDate: new Date('2024-06-25T09:00:00'),
    isMySchedule: true, // 내 일정 여부
  },
  {
    type: '경제지표',
    announcementDate: new Date('2024-06-11T09:00:00'),
    name: 'Retail Sales',
    importance: 1,
    actualValue: 5.1,
    predictedValue: 5.0,
    previousValue: 4.9,
    isMySchedule: true, // 내 일정 여부
  },
  {
    type: '경제지표',
    announcementDate: new Date('2024-06-12T09:00:00'),
    name: 'Retail Sales',
    importance: 1,
    actualValue: 5.1,
    predictedValue: 5.0,
    previousValue: 4.9,
    isMySchedule: false, // 내 일정 여부
  },
  {
    type: '배당',
    exDividendDate: new Date('2024-06-12T09:00:00'),
    companyName: 'Company Z',
    dividend: {
      actual: 3.5,
      previous: 3.4,
    },
    paymentDate: new Date('2024-06-25T09:00:00'),
    isMySchedule: true, // 내 일정 여부
  },
];

export { dummyDataList };
