import {User} from "@models/user";

export interface IEventTask {
  id?: number;
  name: string;
  due_date: Date;
  description?: string;
  status: EventStatus;
  tender_id: number;
  user_id?: number;
  client_id?: number;
  user?: User;
}

export enum EventStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed'
}
