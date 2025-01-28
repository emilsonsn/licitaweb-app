import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order, PageControl } from '@models/application';
import { SupplierOccurrenceService } from '@services/supplier-occurrence.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-occurrence-supplier',
  templateUrl: './dialog-occurrence-supplier.component.html',
  styleUrl: './dialog-occurrence-supplier.component.scss'
})
export class DialogOccurrenceSupplierComponent {
  form: FormGroup;
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
  public PageNewOccurrence = false;
  public occurrences = [];

  public pageControl: PageControl = {
    take: 50,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    order: Order.ASC,
  };

  pageEvent($event: any) {
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
    this.searchOccurrence();
  }

  constructor(
    private readonly _toastr: ToastrService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogOccurrenceSupplierComponent>,
    private readonly _occurrencesService: SupplierOccurrenceService,
    @Inject(MAT_DIALOG_DATA)
    public data: { id: number }
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      supplier_id: ['', Validators.required],
      files: [''],
    });

    this.form.patchValue({ supplier_id: this.data.id });
    this.searchOccurrence();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  searchOccurrence(): void {
    const id = this.form.get('supplier_id')?.value;
    const filters = {supplier_id: id};

    this._occurrencesService.search(this.pageControl, filters)
      .subscribe((occurrences) => {
        this.occurrences = occurrences.data;

        this.pageControl.page = occurrences.current_page - 1;
        this.pageControl.itemCount = occurrences.total;
        this.pageControl.pageCount = occurrences.last_page;
      });
  }

  newOccurrence() {
    this.PageNewOccurrence = !this.PageNewOccurrence
    this.filesToSend = [];
    this.filesToRemove = [];
    this.filesFromBack = [];
    this.form.patchValue({ supplier_id: this.data.id });
    this.form.get('title').setValue('');
    this.form.get('description').setValue('');
    this.form.get('files').setValue('');

  }

  public openImgInAnotherTab(url: string) {
    window.open(url, '_blank');
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

  public prepareFileToRemoveFromBack(fileId, index) {
    this.filesFromBack.splice(index, 1);
    this.filesToRemove.push(fileId);
    // this.deleteAttachment(fileId);
  }

  public removeFileFromSendToFiles(index: number) {
    if (index > -1) {
      this.filesToSend.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.PageNewOccurrence = !this.PageNewOccurrence
      return;
    }

    const formData = new FormData();

    // Adiciona os dados do formulário
    formData.append('title', this.form.get('title').value);
    formData.append('description', this.form.get('description').value);
    formData.append('supplier_id', this.form.get('supplier_id').value);

    let supplier_files: File[] = [];
    for (let file of this.filesToSend) {
      supplier_files.push(file.file);
    }

    supplier_files?.forEach((element, index) => {
      formData.append(`files[${index}]`, element);
    });

    this._occurrencesService.create(formData)
      .subscribe({
        next: (res) => {
          this.newOccurrence()
          this.searchOccurrence();
          this._toastr.success(res.message);
        },
        error: (err) => {
          this._toastr.error(err.error.message);
        },
      });
  }
}
