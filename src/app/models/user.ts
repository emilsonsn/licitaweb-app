export interface User {
  id? : number;
  name : string;
  email : string;
  phone : string;
  cpf : string;
  cpf_cnpj: string;
  birth_date: Date;
  company_position_id: string;
  sector_id: string;
  whatsapp: string;
  status : UserStatus;
  createdAt : string;
  updatedAt : string;
  is_online?: boolean;
  admin?: boolean;
  photo?: string;
  role?: UserRole;
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

export enum UserRole { //Admin,Manager,Collaborator
  Admin = 'Admin',
  Manager = 'Manager',
  Collaborator = 'Collaborator',
}
