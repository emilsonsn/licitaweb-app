import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Estados } from '@models/utils';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';
import { Utils } from '@shared/utils';
import { ToastrService } from 'ngx-toastr';
import { from, map, ReplaySubject } from 'rxjs';
import { SupplierClient } from '@models/supplierClient';

@Component({
  selector: 'app-dialog-supplier',
  templateUrl: './dialog-supplier.component.html',
  styleUrl: './dialog-supplier.component.scss'
})
export class DialogSupplierComponent {

  public isNewClient: boolean = true;
  public title: string = 'Novo Fornecedor';

  public form: FormGroup;

  public loading: boolean = false;

  public zip_code: string;
  public states: string[] = Object.values(Estados);
  public users = [];

  public citys: string[] = [];
  public cityCtrl: FormControl<any> = new FormControl<any>(null);
  public cityFilterCtrl: FormControl<any> = new FormControl<string>('');
  public filteredCitys: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public utils = Utils;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: { supplier: SupplierClient },
    private readonly _dialogRef: MatDialogRef<DialogSupplierComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _utilsService: UtilsService,
    private readonly _userService: UserService

  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      cpf_or_cnpj: [null, [Validators.required]],
      state_registration: [null, [Validators.required]],
      street: [null, [Validators.required]],
      number: [null, [Validators.required]],
      complement: [null, [Validators.required]],
      neighborhood: [null, [Validators.required]],
      city: [null, [Validators.required]],
      zip_code: [null, [Validators.required]],
      landline_phone: [null, [Validators.required]],
      mobile_phone: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      user_id: [null],
    });

    if (this._data) {
      this.isNewClient = false;
      this.title = 'Editar fornecedor';
      this._fillForm(this._data.supplier);
    }

    this.form.get('state_registration').valueChanges.subscribe(res => {
      this.atualizarCidades(res);
    })

    this.cityFilterCtrl.valueChanges
      .pipe()
      .subscribe(() => {
        this.filterCitys();
      })

    this.form.patchValue({
      ...this._data,
    });

    this.getUsers();
  }

  public getUsers() {
    this._userService.getUsers()
      .subscribe((res) => {
        this.users = res.data;
        if (!this._data?.supplier.user_id) {
          const filteredUsers = this.users.filter(user => user.role !== 'Admin');
          const randomUser = filteredUsers[Math.floor(Math.random() * filteredUsers.length)];
          if (randomUser) {
            this.form.get('user_id').patchValue(randomUser.id);
          }
        }

      });
  }

  private _fillForm(supplier: SupplierClient): void {
    this.form.patchValue(supplier);
  }

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

  public onCancel(): void {
    this._dialogRef.close();
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
    const cep = this.form.get('zip_code')?.value;

    if (cep && cep.length === 8) {
      this._utilsService.getAddressByCep(cep).subscribe(res => {
        if (res.erro) {
          this._toastr.error('CEP Inválido para busca!');
        } else {
          this.form.patchValue({
            street: res.logradouro,
            city: res.localidade,
            state_registration: res.uf,
            neighborhood: res.bairro,
          });
        }
      });
    }
  }

  public onSubmit(form: FormGroup): void {
    debugger
    if (!form.valid) {
      form.markAllAsTouched();
    } else {
      const formData = new FormData();
      formData.append('id', form.get('id')?.value);
      formData.append('name', form.get('name')?.value);
      formData.append('cpf_or_cnpj', form.get('cpf_or_cnpj')?.value);
      formData.append('state_registration', form.get('state_registration')?.value);
      formData.append('street', form.get('street')?.value);
      formData.append('number', form.get('number')?.value);
      formData.append('complement', form.get('complement')?.value);
      formData.append('neighborhood', form.get('neighborhood')?.value);
      formData.append('city', form.get('city')?.value);
      formData.append('zip_code', form.get('zip_code')?.value);
      formData.append('landline_phone', form.get('landline_phone')?.value);
      formData.append('mobile_phone', form.get('mobile_phone')?.value);
      formData.append('email', form.get('email')?.value);
      formData.append('user_id', form.get('user_id')?.value);

      if (form.get('cpf_cnpj')?.value.length == 11) {
        formData.append('person_type', 'Person');
      }
      else {
        formData.append('person_type', 'Company');
      }

      this._dialogRef.close(formData);
    }
  }

}
