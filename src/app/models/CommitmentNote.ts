export interface CommitmentNoteProduct {
  id?: number;
  commitment_note_id?: number;
  product_id: number;
  quantity: number;
}

export interface CommitmentNote {
  id?: number;
  contract_id: number;
  status_id: number;
  number: string;
  receipt_date: string;
  purchase_term: string;
  products: CommitmentNoteProduct[];
  created_at?: string;
  updated_at?: string;
}
