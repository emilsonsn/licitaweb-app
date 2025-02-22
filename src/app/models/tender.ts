import {TaskStatus} from "./Task";
import {User} from "./user";

export interface Tender {
  id?: number;
  number: string;
  organ: string;
  modality_id: string;
  contest_date: Date;
  auction_date: Date;
  estimated_value: number;
  status: TaskStatus;
  items_count: number;
  user_id: string;
  user?: User;
  items: string;
  attachments?: string;
  tender_status?: TenderStatus[];

}

export interface TenderStatus {
  id: number;
  position: number;
  status_id: number;
  tender_id: number;
  created_at: Date; // Você pode usar Date se preferir, mas precisará converter
  updated_at: Date; // Idem ao created_at
  deleted_at: Date | null;
}
