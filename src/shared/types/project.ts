export interface Project {
  id: number;
  name: string;
  debug: {
    id: number;
    status: "running" | "stopped" | "initializing" | "loading";
    service_id: string;
  };
  flow: {
    edges: [];
    nodes: [];
  };
}

export interface ChartItem {
  date: string,
  value: number,
}

export interface Dashboard {
  chart: {
    new_users: ChartItem[],
  },
  total_users: number,
}
