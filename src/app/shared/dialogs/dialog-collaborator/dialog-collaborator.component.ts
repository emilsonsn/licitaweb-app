import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User, UserRole} from '@models/user';
import dayjs from 'dayjs';
import {Utils} from '@shared/utils';

@Component({
  selector: 'app-dialog-collaborator',
  templateUrl: './dialog-collaborator.component.html',
  styleUrl: './dialog-collaborator.component.scss'
})
export class DialogCollaboratorComponent {

  public isNewCollaborator: boolean = true;
  public title: string = 'Novo Usuário';
  public form: FormGroup;
  public loading: boolean = false;
  public profileImageFile: File | null = null;
  profileImage: string | ArrayBuffer = null;
  isDragOver: boolean = false;

  public utils = Utils;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: { user: User },
    private readonly _dialogRef: MatDialogRef<DialogCollaboratorComponent>,
    private readonly _fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {

    this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      cpf_cnpj: [null, [Validators.required]],
      birth_date: [null, [Validators.required]],
      role: [null, [Validators.required]],
      phone: [null],
      whatsapp: [null],
      email: [null, [Validators.required]],
    })

    if (this._data?.user) {
      this.isNewCollaborator = false;
      this.title = 'Editar Usuário';
      this._fillForm(this._data.user);
      if (this._data.user.photo) {
        this.profileImage = this._data.user.photo
      }
    }
  }


  applyDateMask(event: any): void {
    let value = event.target.value;

    // Remove qualquer coisa que não seja número
    // value = value.replace(/\D/g, '');


    // Adiciona a máscara 'dd/MM/yyyy' conforme o valor do input
    if (value.length <= 2) {
      value = value.replace(/(\d{2})(\d{1,})/, '$1/$2');
    }
    // Second condition: format as MM/DD/
    else if (value.length <= 4) {
      value = value.replace(/(\d{2})(\d{2})(\d{0,})/, '$1/$2/');
    }
    // Third condition: format as MM/DD/YYYY
    else {
      value = value.replace(/(\d{2})(\d{2})(\d{2})(\d{0,})/, '$1/$2/$3');
    }

    // Atualiza o valor do input
    event.target.value = value;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  removeImage(event: Event): void {
    event.stopPropagation();
    this.profileImage = null;
  }


  private _fillForm(user: User): void {

    this.form.patchValue(user);
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public onSubmit(form: FormGroup): void {
    if (!form.valid) {
      form.markAllAsTouched();
    } else {

      const formData = new FormData();
      formData.append('id', form.get('id')?.value);
      formData.append('name', form.get('name')?.value);
      formData.append('cpf_cnpj', form.get('cpf_cnpj')?.value);
      formData.append('birth_date', dayjs(form.get('birth_date')?.value).format('YYYY-MM-DD'));
      formData.append('phone', form.get('phone')?.value);
      formData.append('whatsapp', form.get('whatsapp')?.value);
      formData.append('email', form.get('email')?.value);
      formData.append('role', form.get('role')?.value);
      formData.append('photo', this.profileImageFile);

      this._dialogRef.close(formData)
    }
  }

  validateCellphoneNumber(control: any) {
    const phoneNumber = control.value;
    if (phoneNumber && phoneNumber.replace(/\D/g, '').length !== 11) {
      return false;
    }
    return true;
  }

  validatePhoneNumber(control: any) {
    const phoneNumber = control.value;
    if (phoneNumber && phoneNumber.replace(/\D/g, '').length !== 10) {
      return false;
    }
    return true;
  }

  protected readonly Object = Object;
  protected readonly UserRole = UserRole;
}
