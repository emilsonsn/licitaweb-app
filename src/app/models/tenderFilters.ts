import { StatusLicitaWeb } from "./statusLicitaWeb";

export interface TenderFilters {
  start_contest_date?: string;
  end_contest_date? : string;
  status?: StatusLicitaWeb;
  modality_id?: number;
  order?: string;
  user_id?: string;
  is_contract?: number;
  }
