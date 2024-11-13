
export interface TenderTask {
  id: string;
  name: string;
  description: string;
  user_id?: string;
  tender_id: string;
  status?: TenderTaskStatusEnum;
}

export enum TenderTaskStatusEnum {
  Pending = "Pendente",
  InProgress = "InProgress",
  Completed = "Completed",
}

const taskStatusMap: Record<number, TenderTaskStatusEnum> = {
  1: TenderTaskStatusEnum.Pending,
  2: TenderTaskStatusEnum.InProgress,
  3: TenderTaskStatusEnum.Completed,
};

export interface TaskStatus {
  id: number;
  name: string;
  color: string;
}

interface TaskFiles {
  id: number;
  name: string;
  path: string;
  task_id: number;
  created_at: Date;
  updated_at: Date;
}
