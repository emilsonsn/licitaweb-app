import { Component, Inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import dayjs from 'dayjs';
import { ToastrService } from 'ngx-toastr';
import { TenderService } from '@services/tender.service';
import { StatusLicitaWeb } from '@models/statusLicitaWeb';
import { ModalityService } from '@services/modality.service';
import { Modality } from '@models/modality';
import { UserService } from '@services/user.service';
import { User } from '@models/user';
import utc from 'dayjs/plugin/utc'; // Importa o plugin utc
import { TaskService } from '@services/task.service';

dayjs.extend(utc);

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
  public users: User[];
  public Status: any[] = [];

  protected filesToRemove: number[] = [];
  protected filesFromBack: {
    index: number,
    id: number,
    name: string,
    path: string,
  }[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    protected readonly _data,
    private _fb: FormBuilder,
    private readonly _dialogRef: MatDialogRef<DialogNoticesComponent>,
    private _tender: TenderService,
    private _modalityService: ModalityService,
    private _userService: UserService,
    private readonly _toastr: ToastrService,
    private readonly _taskService: TaskService
  ) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      id: [''],
      external_id: [''],
      number: ['', Validators.required],
      modality_id: ['', Validators.required],
      organ: ['', Validators.required],
      contest_date: ['', Validators.required],
      object: ['', Validators.required],
      estimated_value: [null, [Validators.required, Validators.min(0)]],
      user_id: ['', Validators.required],
      items_count: [null],
      status_id: ['', Validators.required],
      items: this._fb.array([]),
      attachments: [''],
    });

    if (this._data) {

      if(!this._data?.import){
        this.isNewTender = false;
        this.title = 'Editar Edital';
      }

      if (this._data.items) {
        this._data.items.forEach(item => {
          this.items.push(this.createItemFromData(item));
        });
      }

      if (this._data.attachments) {
        this._data.attachments.forEach((file, index) => {
          this.filesFromBack.push({
            index: index,
            id: file.id,
            name: file.filename,
            path: file.path
          });
        });
      }

      if (!this._data.edit) {
        this.isToEdit = true;
      }

      const adjustedDate = dayjs(this._data.contest_date).toDate();

      this.form.patchValue({
        ...this._data,
        contest_date: adjustedDate,
        status_id: this._data?.status?.id || null // Use um fallback, como null, caso status ou id seja indefinido
      });


    }

    this.form.get('items').valueChanges.subscribe((items) => {
      if (!items[items.length - 1]?.unit_value && !items[items.length - 1]?.quantity) return

      this.form.get('items_count').setValue(0);
      this.form.get('estimated_value').setValue(0);

      let newTotal = 0;
      let newValue = 0;

      items.forEach(item => {
        newValue += (+item?.unit_value * +item?.quantity);
        newTotal += (+item?.quantity);
      });

      this.form.get('items_count').setValue(+newTotal.toFixed(2));
      this.form.get('estimated_value').setValue(+newValue.toFixed(2));
    });

    this.getModalities();
    this.getUsers();
    this.getStatus();
  }

  public getStatus() {
    this._taskService.getStatusTasks()
      .subscribe({
        next: (status) => {
          this.Status = status.data;
          if(!this._data?.id){
            this.form.get('status_id').patchValue(status.data[0].id);
          }
        },
        error: (err) => {
          console.error(err);
        }
      })
  }

  public getUsers() {
    this._userService.getUsers()
      .subscribe((res) => {
        this.users = res.data;
        if(!this._data?.id){
          const filteredUsers = this.users.filter(user => user.role !== 'Admin');
          const randomUser = filteredUsers[Math.floor(Math.random() * filteredUsers.length)];
          if (randomUser) {
            this.form.get('user_id').patchValue(randomUser.id);
          }
        }

      });
  }

  public getModalities() {
    this._modalityService.getModalities()
      .subscribe((modalities) => {
        this.modalities = modalities.data;
        if(!this._data?.id){
          modalities.data.forEach((modality) =>{
            if(modality.name == 'Leilão Eletrônico'){
              this.form.get('modality_id').patchValue(modality.id);
            }
          });
        }
      });
  }

  public openImgInAnotherTab(url: string) {
    window.open(url, '_blank');
  }

  public prepareFileToRemoveFromBack(fileId, index) {
    this.filesFromBack.splice(index, 1);
    this.filesToRemove.push(fileId);
    this.deleteAttachment(fileId);
  }

  public deleteAttachment(fileId: number) {
    this._tender.deleteItemAttachment(fileId).subscribe({
      next: () => {
        this._toastr.success("Anexo deletado com sucesso");

        const fileIndex = this.filesFromBack.findIndex(file => file.id === fileId);
        if (fileIndex > -1) {
          this.filesFromBack.splice(fileIndex, 1);
        }
      },
      error: (err) => {
        this._toastr.error(err.error.error);
      }
    });
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
    } else {
      const formData = new FormData();

      // Mapeando os campos do novo formulário
      formData.append('id', form.get('id')?.value ?? '');
      formData.append('external_id', form.get('external_id')?.value ?? '');
      formData.append('number', form.get('number')?.value);
      formData.append('organ', form.get('organ')?.value);
      formData.append('modality_id', form.get('modality_id')?.value);
      formData.append('contest_date', dayjs(form.get('contest_date')?.value).format('YYYY-MM-DD'));
      formData.append('object', form.get('object')?.value);
      formData.append('estimated_value', form.get('estimated_value')?.value);
      formData.append('status_id', form.get('status_id')?.value);
      formData.append('items_count', form.get('items_count')?.value);
      formData.append('user_id', form.get('user_id')?.value);
      form.get('items')?.value.forEach((element, index) => {
        formData.append(`items[${index}]`, JSON.stringify(element));
      });

      let tender_files: File[] = [];
      for (let file of this.filesToSend) {
        tender_files.push(file.file);
      }

      tender_files?.forEach((element, index) => {
        formData.append(`attachments[${index}]`, element);
      });

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
      item: [{ value: item.key }, [Validators.required]],
      unit_value: [item.unit_value, [Validators.required]],
      quantity: [item.type, [Validators.required]],
    });
  }

  public onDeleteItem(index: number): void {
    if (!this.items.value[index].id) {
      this.items.removeAt(index);
      return;
    }

    this.deleteItem(index)
  }

  // Items
  public createItem(): FormGroup {
    return this._fb.group({
      id: [null],
      item: [null, Validators.required],
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
