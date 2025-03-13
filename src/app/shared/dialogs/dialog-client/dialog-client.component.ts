import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from '@models/client';
import { Estados } from '@models/utils';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';
import { Utils } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';
import { from, map, ReplaySubject } from 'rxjs';
import {ClientService} from "@services/client.service";

@Component({
  selector: 'app-dialog-client',
  templateUrl: './dialog-client.component.html',
  styleUrl: './dialog-client.component.scss'
})
export class DialogClientComponent {

  public isNewClient: boolean = true;
  public title: string = 'Novo cliente';
  public form: FormGroup;
  public loading : boolean = false;
  public cep : string;
  public states : string[] = Object.values(Estados);
  public users = [];
  public flags = ['Verde', 'Amarelo', 'Vermelho'];
  public citys : string[] = [];
  public cityCtrl: FormControl<any> = new FormControl<any>(null);
  public cityFilterCtrl: FormControl<any> = new FormControl<string>('');
  public filteredCitys: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public utils = Utils;
  protected filesToRemove: number[] = [];
  protected filesFromBack: {
    index: number,
    id: number,
    name: string,
    path: string,
  }[] = [];
  protected filesToSend: {
    id: number,
    preview: string,
    file: File,
  }[] = [];
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

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: Client,
    private readonly _dialogRef: MatDialogRef<DialogClientComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr : ToastrService,
    private readonly _utilsService : UtilsService,
    private readonly _userService : UserService,
    private readonly _clientService : ClientService
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      cpf_cnpj: [null],
      fix_phone: [null],
      whatsapp: [null],
      email: [null],
      address: [null, ],
      city: [null, ],
      state: [null, ],
      number: [null,],
      complement: [null, ],
      user_id: [null, [Validators.required]],
      flag: [null,],
      cep: [null,],
      attachments: [''],
    });

    if (this._data) {
      this.isNewClient = false;
      this.title = 'Editar cliente';
      this._fillForm(this._data);
    }
    if (this._data?.attachments) {
      this._data.attachments.forEach((file, index) => {
        this.filesFromBack.push({
          index: index,
          id: file.id,
          name: file.filename,
          path: file.path
        });
      });
    }

    this.form.get('state').valueChanges.subscribe(res => {
      this.atualizarCidades(res);
    })

    this.cityFilterCtrl.valueChanges
      .pipe()
      .subscribe(() => {
        this.filterCitys();
      });

    this.getUsers();

    this.form.patchValue({
      ...this._data,
    });
  }

  public getUsers() {
    this._userService.getUsers()
      .subscribe((res) => {
        this.users = res.data;
        if(!this._data?.user_id){
          const filteredUsers = this.users.filter(user => user.role !== 'Admin');
          const randomUser = filteredUsers[Math.floor(Math.random() * filteredUsers.length)];
          if (randomUser) {
            this.form.get('user_id').patchValue(randomUser.id);
          }
        }

      });
  }

  private _fillForm(client: Client): void {
    this.form.patchValue(client);
  }

  public onCancel(): void {
    this._dialogRef.close();
  }

  public onSubmit(form: FormGroup): void {
    if(!form.valid){
      form.markAllAsTouched();
    }else{
      const formData = new FormData();
      formData.append('id', form.get('id')?.value);
      formData.append('name', form.get('name')?.value);
      formData.append('cpf_cnpj', form.get('cpf_cnpj')?.value);
      formData.append('fix_phone', form.get('fix_phone')?.value);
      formData.append('whatsapp', form.get('whatsapp')?.value);
      formData.append('email', form.get('email')?.value);
      formData.append('address', form.get('address')?.value);
      formData.append('city', form.get('city')?.value);
      formData.append('state', form.get('state')?.value);
      formData.append('number', form.get('number')?.value);
      formData.append('complement', form.get('complement')?.value);
      formData.append('user_id', form.get('user_id')?.value);
      formData.append('flag', form.get('flag')?.value);
      formData.append('cep', form.get('cep')?.value);

      if (form.get('cpf_cnpj')?.value?.length > 0
      ) {
        if(form.get('cpf_cnpj')?.value.length == 11){
          formData.append('type', 'Person');
        }
        else{
          formData.append('type', 'Company');
        }
      }

      let tender_files: File[] = [];
      for (let file of this.filesToSend) {
        tender_files.push(file.file);
      }

      tender_files?.forEach((element, index) => {
        formData.append(`attachments[${index}]`, element);
      });

      this._dialogRef.close(formData)
    }
  }

  imgLoadError(event: Event, img: any) {
    img.error = true; // Define um estado indicando erro na imagem
    (event.target as HTMLImageElement).style.display = 'none'; // Esconde a imagem quebrada
  }


  // Utils

  public atualizarCidades(uf: string): void {
    this._utilsService.obterCidadesPorEstado(uf)
      .pipe(
        map(res => res.map(city => city.nome))
      )
      .subscribe({
        next: (names) => {
          this.citys = names;
          this.filteredCitys.next(this.citys.slice());
        },
        error: (error) => {
          console.error('Erro ao obter cidades:', error);
        }
      });
  }

  protected filterCitys() {
    if (!this.citys) {
      return;
    }
    let search = this.cityFilterCtrl.value;
    if (!search) {
      this.filteredCitys.next(this.citys.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredCitys.next(
      this.citys.filter(city => city.toLowerCase().indexOf(search) > -1)
    );
  }

  public openImgInAnotherTab(url: string) {
    window.open(url, '_blank');
  }

  public prepareFileToRemoveFromBack(fileId, index) {
    this.filesFromBack.splice(index, 1);
    this.filesToRemove.push(fileId);
    this.deleteAttachment(fileId);
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

  public deleteAttachment(fileId: number) {
    this._clientService.deleteItemFile(fileId).subscribe({
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

  public async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
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

  public autocompleteCep() {
    const cep = this.form.get('cep')?.value;

    if (cep && cep.length === 8) {
      this._utilsService.getAddressByCep(cep).subscribe(res => {
        if (res.erro) {
          this._toastr.error('CEP Inválido para busca!');
        } else {
          this.form.patchValue({
            address: res.logradouro,
            city: res.localidade,
            state: res.uf
          });
        }
      });
    }
  }


}

