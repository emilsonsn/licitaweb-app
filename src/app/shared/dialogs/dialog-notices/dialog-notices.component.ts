import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {afterNextRender, Component, inject, Inject, Injector, signal, ViewChild} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {ApiResponse, PaymentForm} from '@models/application';
import { Construction } from '@models/construction';
import { Supplier, SupplierType } from '@models/supplier';
import {Banco, OrderResponsible, RequestOrder, RequestOrderStatus, RequestOrderType} from '@models/requestOrder';
import { User } from '@models/user';
import { ConstructionService } from '@services/construction.service';
import { OrderService } from '@services/order.service';
import { SupplierService } from '@services/supplier.service';
import { UserService } from '@services/user.service';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { dateValidator } from '@shared/validators/date';
import { DialogOrderSolicitationComponent } from '../dialog-order-solicitation/dialog-order-solicitation.component';
import { RequestService } from '@services/request.service';
import { RequestStatus } from '@models/request';
import { SessionQuery } from '@store/session.query';
import { TenderService } from '@services/tender.service';

@Component({
  selector: 'app-dialog-notices',
  templateUrl: './dialog-notices.component.html',
  styleUrl: './dialog-notices.component.scss'
})
export class DialogNoticesComponent {
  public form: FormGroup;
  public title: string = 'Novo Edital';
  public isNewTender: boolean = true;
  public loading: boolean = false;
  public tenderModalityEnum;

  constructor(
    private _fb: FormBuilder,
    private readonly _dialogRef: MatDialogRef<DialogNoticesComponent>,
    private _tender: TenderService,
  ) {
    this.form = this._fb.group({
      editNumber: ['', Validators.required],
      issuingAgency: ['', Validators.required],
      registrationDate: ['', Validators.required],
      certameDate: ['', Validators.required],
      editObject: ['', Validators.required],
      estimatedValue: [null, [Validators.required, Validators.min(0)]],
      internalResponsible: ['', Validators.required],
      itemQuantity: [null, [Validators.required, Validators.min(1)]],
    });
  }

  onSubmit(form) {
    if (!form.valid) {
      form.markAllAsTouched();
    } else {
      const formData = new FormData();

      // Mapeando os campos do novo formulário
      formData.append('editNumber', form.get('editNumber')?.value);
      formData.append('issuingAgency', form.get('issuingAgency')?.value);
      formData.append('registrationDate', dayjs(form.get('registrationDate')?.value).format('YYYY-MM-DD'));
      formData.append('certameDate', dayjs(form.get('certameDate')?.value).format('YYYY-MM-DD'));
      formData.append('editObject', form.get('editObject')?.value);
      formData.append('estimatedValue', form.get('estimatedValue')?.value);
      formData.append('internalResponsible', form.get('internalResponsible')?.value);
      formData.append('itemQuantity', form.get('itemQuantity')?.value);

      /* // Adicionando imagem de perfil, se existir
      if (this.profileImageFile) {
        formData.append('photo', this.profileImageFile);
      } */

      // Enviando os dados do formulário para o componente pai
      this._dialogRef.close(formData);
    }
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public updateModalityTender() {
    this._tender.getTenderModality()
      .subscribe(res => {
        this.tenderModalityEnum = res.data;
      })
  }



}
