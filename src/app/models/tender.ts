import { StatusLicitaWeb } from "./statusLicitaWeb";

export interface Tender {
  id? : number;
  number : string;
  organ : string;
  modality_id : string;
  contest_date : Date;
  estimated_value : number;
  status: StatusLicitaWeb;
  items_count: number;
  user_id: string;
  items: string;
  attachments?: string;
}

export interface UserPosition {
  id? : string,
  position : string
}

export interface UserSector {
  id? : number,
  sector : string
}

export interface UserCards {
  total: number;
  active: number;
  inactive: number;
}

export enum UserStatus {
	ATIVO = 'ACTIVE',
	INATIVO = 'INACTIVE',
	BLOQUEADO = 'BLOCKED',
}


export enum Positions { //Gerente/Gestor/Adm/Tiago
  Admin = 'Admin',
  Financial = 'Financial',
  Supplies = 'Supplies',
  Requester = 'Requester'
}
