import {Pipe, PipeTransform} from '@angular/core';
import {UserRole} from "@models/user";

@Pipe({
  name: 'companyPosition'
})
export class CompanyPositionPipe implements PipeTransform {

  transform(value: UserRole) {
    switch (value) {
      case UserRole.Admin:
        return 'Administrador';
      case UserRole.Collaborator:
        return 'Colaborador';
      case UserRole.Manager:
        return 'Manager';

      default:
        return value;
    }
  }
}
