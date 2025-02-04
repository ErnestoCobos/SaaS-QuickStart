export const TIME_RANGES = ['D', 'W', 'M', 'Y'] as const

export const METRIC_CARDS = [
  {
    title: 'Total Revenue',
    value: 45231.89,
    trend: 'up',
    percentage: 20.1
  },
  {
    title: 'Subscriptions',
    value: 2350,
    trend: 'down',
    percentage: 4.5
  },
  {
    title: 'Active Users',
    value: 1234,
    trend: 'up',
    percentage: 10.2
  }
] as const

export const CHART_CONFIG = {
  height: 400,
  margin: { top: 20, right: 20, bottom: 20, left: 20 }
}
