import { User } from "./user";

export interface SupplierClient {
  id?: number;
  name: string;
  cpf_or_cnpj: string;
  state_registration: string;
  street: string;
  number: number;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  landline_phone: number;
  mobile_phone: number;
  email: string;
  user_id: string;
  user: User;
  person_type: string;
}


