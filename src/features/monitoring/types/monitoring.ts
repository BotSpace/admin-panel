export interface MonitoringChartData {
  dates: string[];
  values: number[];
}

export interface MonitoringChart {
  ram: MonitoringChartData;
  cpu: MonitoringChartData;
  net_tx: MonitoringChartData;
  net_rx: MonitoringChartData;
  storage: MonitoringChartData;
}

export interface MonitoringData {
  used_storage: number | null;
  used_ram: number | null;
  used_cpu: number | null;
  used_net_tx: number | null;
  used_net_rx: number | null;
  chart: MonitoringChart;
}

export interface MonitoringResponse {
  status: boolean;
  data: MonitoringData;
}

