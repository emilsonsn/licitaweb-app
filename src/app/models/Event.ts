export interface IEventTask {
  id?: number;
  name: string;
  due_date: string;
  description?: string;
  status: EventStatus;
  tender_id: number;
  user_id?: number;
}

export enum EventStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed'
}
