export interface BotType {
  id: number;
  name: string;
  users: number;
  username: string | null;
  avatar: string | null;
  release: {
    id: number;
    version: number;
    status: string;
    service_id: string;
  } | null;
}
