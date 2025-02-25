import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {OriginEnum, Product} from '@models/product';
import {SupplierClient} from '@models/supplierClient';
import {SupplierService} from '@services/supplier.service';
import {Utils} from '@shared/utils';
import {ToastrService} from "ngx-toastr";
import {ProductService} from "@services/product.service";

@Component({
  selector: 'app-dialog-product',
  templateUrl: './dialog-product.component.html',
  styleUrl: './dialog-product.component.scss'
})
export class DialogProductComponent {
  protected filesToSend: {
    id: number,
    preview: string,
    file: File,
  }[] = [];
  public isNewProduct: boolean = true;
  public title: string = 'Novo produto';
  public originKeys = Object.keys(OriginEnum).filter(key => isNaN(Number(key)));
  public originEnum = OriginEnum;
  protected filesFromBack: {
    index: number,
    id: number,
    name: string,
    path: string,
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

  public form: FormGroup;
  public suppliers: SupplierClient[];
  protected filesToRemove: number[] = [];
  public loading : boolean = false;

  public utils = Utils;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private readonly _data: Product,
    private readonly _dialogRef: MatDialogRef<DialogProductComponent>,
    private readonly _fb: FormBuilder,
    private readonly _toastr: ToastrService,
    private readonly _supplierService : SupplierService,
    private readonly _productService : ProductService,
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      sku: [null, [Validators.required]],
      category: [null, [Validators.required]],
      // detailed_description: [null, [Validators.required]],
      technical_information: [null, [Validators.required]],
      size: [null, [Validators.required]],
      brand: [null, [Validators.required]],
      origin: [null, [Validators.required]],
      model: [null, [Validators.required]],
      purchase_cost: [null, [Validators.required]],
      freight: [null, [Validators.required]],
      taxes_fees: [null, [Validators.required]],
      attachments: [''],
      // total_cost: [null, [Validators.required]],
      profit_margin: [null, [Validators.required]],
      // sale_price: [null, [Validators.required]],
      supplier_id: [null, [Validators.required]],
    });

    this._supplierService.getSuppliers().subscribe()

    if (this._data) {
      this.isNewProduct = false;
      this.title = 'Editar produto';
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

    this.getSuppliers();

    this.form.patchValue({
      ...this._data,
    });
  }

  private getSuppliers() {
    this._supplierService.getSuppliers()
      .subscribe((res) => {
        this.suppliers = res.data;
      });
  }

  private _fillForm(product: Product): void {
    this.form.patchValue(product);
  }

  public openImgInAnotherTab(url: string) {
    window.open(url, '_blank');
  }

  public prepareFileToRemoveFromBack(fileId, index) {
    this.filesFromBack.splice(index, 1);
    this.filesToRemove.push(fileId);
    this.deleteAttachment(fileId);
  }

  imgLoadError(event: Event, img: any) {
    img.error = true; // Define um estado indicando erro na imagem
    (event.target as HTMLImageElement).style.display = 'none'; // Esconde a imagem quebrada
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
    this._productService.deleteItemFile(fileId).subscribe({
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

  public onCancel(): void {
    this._dialogRef.close();
  }

  public onSubmit(form: FormGroup): void {
    if (!form.valid) {
      form.markAllAsTouched();
    } else {
      const formData = new FormData();

      // Adiciona os campos do formulário ao FormData
      Object.keys(form.value).forEach((key) => {
        if (form.value[key] !== null && form.value[key] !== undefined) {
          formData.append(key, form.value[key]);
        }
      });

      // Adiciona os arquivos ao FormData
      let tender_files: File[] = [];
      for (let file of this.filesToSend) {
        tender_files.push(file.file);
      }

      tender_files.forEach((element, index) => {
        formData.append(`attachments[${index}]`, element);
      });

      this._dialogRef.close(formData);
    }
  }

}
