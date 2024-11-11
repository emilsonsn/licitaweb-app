import {Component, Inject} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { dateValidator } from '@shared/validators/date';
import { DialogOrderSolicitationComponent } from '../dialog-order-solicitation/dialog-order-solicitation.component';
import { RequestService } from '@services/request.service';
import { RequestStatus } from '@models/request';
import { SessionQuery } from '@store/session.query';
import { TenderService } from '@services/tender.service';
import { StatusLicitaWeb } from '@models/statusLicitaWeb';
import { ModalityService } from '@services/modality.service';
import { Modality } from '@models/modality';

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
  protected Status = Object.values(StatusLicitaWeb);
  protected isToEdit: boolean = false;
  public allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word (.docx)
    'application/msword', // Word (.doc)
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (.xlsx)
    'application/vnd.ms-excel' // Excel (.xls)
  ];
  protected filesToSend: {
    id: number,
    preview: string,
    file: File,
  }[] = [];

  public modalities: Modality[];

  protected filesToRemove : number[] = [];
  protected filesFromBack : {
    index : number,
    id: number,
    name: string,
    path: string, // Wasabi
  }[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private _fb: FormBuilder,
    private readonly _dialogRef: MatDialogRef<DialogNoticesComponent>,
    private _tender: TenderService,
    private _modalityService: ModalityService,
    private readonly _toastr : ToastrService,
  ) { }

  ngOnInit() {
    this.form = this._fb.group({
      editNumber: ['', Validators.required],
      issuingAgency: ['', Validators.required],
      certameDate: ['', Validators.required],
      object: ['', Validators.required],
      estimatedValue: [null, [Validators.required, Validators.min(0)]],
      internalResponsible: ['', Validators.required],
      itemQuantity: [null, [Validators.required, Validators.min(1)]],
      status: ['', Validators.required],
      items: this._fb.array([]),
      total_value: [null, Validators.required],
    });

    if (this._data) {
      this.isNewTender = false;
      this.title = 'Editar Edital';

      if (this._data.tender.items) {
        this._data.tender.items.forEach(item => {
          this.items.push(this.createItemFromData(item));
        });
      }

      if (!this._data.edit) {
        this.isToEdit = true;
        this.form.disable();

        (this.items as FormArray).controls.forEach((item: AbstractControl) => {
          item.disable();
        });
      }

      this.form.patchValue(this._data.tender);
    } else {
      this.items.push(this.createItem());
    }

    this.form.get('items').valueChanges.subscribe((items) => {
      if (!items[items.length - 1]?.unit_value && !items[items.length - 1]?.quantity) return

      this.form.get('itemQuantity').setValue(0);
      this.form.get('total_value').setValue(0);

      let newTotal = 0;
      let newValue = 0;

      items.forEach(item => {
        newValue += (+item?.unit_value * +item?.quantity);
        newTotal += (+item?.quantity);
      });

      this.form.get('itemQuantity').setValue(+newTotal.toFixed(2));
      this.form.get('total_value').setValue(+newValue.toFixed(2));
    });

    this.getModalities();
  }

  public getModalities() {
    this._modalityService.getModalities()
    .subscribe((modalities) => {
      this.modalities = modalities.data;
    });    
  }

  public openImgInAnotherTab(url: string) {
    window.open(url, '_blank');
  }

  public prepareFileToRemoveFromBack(fileId, index) {
    this.filesFromBack.splice(index, 1);
    this.filesToRemove.push(fileId);
  }

  public removeFileFromSendToFiles(index: number) {
    if (index > -1) {
      this.filesToSend.splice(index, 1);
    }
  }

  public async onFileSelected(event: any) {
    const files: FileList = event.target.files;
    const fileArray: File[] = Array.from(files);

    for (const file of fileArray) {
      if (this.allowedTypes.includes(file.type)) {
        let base64: string = null;

        if (file.type.startsWith('image/')) {
          base64 = await this.convertFileToBase64(file);
        }

        this.filesToSend.push({
          id: this.filesToSend.length + 1,
          preview: base64,
          file: file,
        });
      } else
        this._toastr.error(`${file.type} não é permitido`);
    }
  }

  public async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  onSubmit(form) {
    if (!form.valid) {
      form.markAllAsTouched();
      console.log(form.controls);
    } else {
      const formData = new FormData();

      // Mapeando os campos do novo formulário
      formData.append('editNumber', form.get('editNumber')?.value);
      formData.append('issuingAgency', form.get('issuingAgency')?.value);
      formData.append('registrationDate', dayjs(form.get('registrationDate')?.value).format('YYYY-MM-DD'));
      formData.append('certameDate', dayjs(form.get('certameDate')?.value).format('YYYY-MM-DD'));
      formData.append('object', form.get('object')?.value);
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

  /* public updateModalityTender() {
    this._tender.getTenderModality()
      .subscribe(res => {
        this.tenderModalityEnum = res.data;
      })
  } */

  public get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  private createItemFromData(item: any): FormGroup {
    return this._fb.group({
      id: [item.id],
      name: [{value: item.key}, [Validators.required]],
      unit_value: [item.unit_value, [Validators.required]],
      quantity: [item.type, [Validators.required]],
    });
  }

  public onDeleteItem(index: number): void {
    if (!this.items.value[index].id) {
      this.items.removeAt(index);

      if (this.items.length === 0) {
        this.items.push(this.createItem());
      }
      return;
    }

    this.deleteItem(index)

    if (this.items.length === 0) {
      this.items.push(this.createItem());
    }
  }

  // Items
  public createItem(): FormGroup {
    return this._fb.group({
      id: [null],
      name: [null, Validators.required],
      unit_value: [null, Validators.required],
      quantity: [null, Validators.required]
    });
  }

  public pushItem(): void {
    this.items.push(this.createItem());
  }

  private deleteItem(index) {
    this._tender.deleteItem(this.items.value[index].id)
      .subscribe({
        next: () => {
          this._toastr.success("Item deletado com sucesso");
          this.items.removeAt(index);
        },
        error: (err) => {
          this._toastr.error(err.error.error);
        }
      })
  }
}
