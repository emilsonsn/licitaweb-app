import {User} from "@models/user";

export interface Log {
  id: number;
  user_id: number;
  description: string;
  request: string;
  created_at: string;
  updated_at: string;
  user: User;
}
