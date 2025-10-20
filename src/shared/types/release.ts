export interface Release {
  id: number;
  version: number;
  status:
    | "pending"
    | "initializing"
    | "running"
    | "stopped"
    | "stopping"
    | "failed"
    | "suspended";
  service_id: string;
}
