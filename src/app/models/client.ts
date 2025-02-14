import { User } from "./user";

export interface Client {
  id?: number;
  name: string;
  cpf_cnpj: string;
  fix_phone: number;
  whatsapp: number;
  email: string;
  address: string;
  city: string;
  state: string;
  created_at?: Date;
  updated_at?: Date;
  complement: string;
  user_id: string;
  user: User;
  flag: string;
  cep: string;
  attachments?: any[]
}
