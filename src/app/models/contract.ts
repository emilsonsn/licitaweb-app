import {Tender} from "@models/tender";
import {Client} from "@models/client";


export interface Contract {
  id: number,
  contract_number: number,
  client_id: number,
  tender_id: number,
  contract_object: number,
  signature_date: Date,
  start_date: Date,
  end_date: Date,
  status: string,
  total_contract_value: number,
  payment_conditions: number,
  outstanding_balance: any,
  observations: string,
  created_at: Date,
  updated_at: Date,
  deleted_at: any,
  attachments?: [],
  tender?: Tender
  client?: Client
}
