import { User } from "./user";
import {StatusLicitaWeb} from "@models/statusLicitaWeb";

export interface Task {
  id: string;
  user_id: string;
  name: string;
  description: string;
  task_status_id: number;
  contest_date?: Date;
  concluded_at?: Date;
  estimated_value: number;
  created_at?: Date;
  updated_at?: Date;
  sub_tasks: any[];
  tasks_files: any[]
  files: any[];
  user: User;
  status?: TaskStatus;
}

export enum TaskStatusEnum {
  Pending = "Pending",
  InProgress = "InProgress",
  Completed = "Completed",
  Canceled = "Canceled",
  Archived = "Archived"
}

const taskStatusMap: Record<number, TaskStatusEnum> = {
  1: TaskStatusEnum.Pending,
  2: TaskStatusEnum.InProgress,
  3: TaskStatusEnum.Completed,
  4: TaskStatusEnum.Canceled,
  5: TaskStatusEnum.Archived
};

export function getTaskStatus(task: Task): TaskStatusEnum | undefined {
  return taskStatusMap[task.task_status_id];
}



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
