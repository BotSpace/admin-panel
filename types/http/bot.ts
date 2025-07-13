export interface BotType {
  id: number;
  name: string;
  username: string;
  is_active: boolean;
  avatar: string | null;
  clients_count: number;
}
