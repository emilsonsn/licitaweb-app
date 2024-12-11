import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Order, PageControl } from '@models/application';
import { TenderOccurrenceService } from '@services/tender-occurrence.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-ocurrence',
  templateUrl: './dialog-ocurrence.component.html',
  styleUrl: './dialog-ocurrence.component.scss'
})
export class DialogOcurrenceComponent {
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
    private readonly _tenderOccurence: TenderOccurrenceService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogOcurrenceComponent>,
    private readonly _occurrencesService: TenderOccurrenceService,
    @Inject(MAT_DIALOG_DATA)
    public data: { id: number }
  ) { }

  ngOnInit(): void {
    this.searchOccurrence();

    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tender_id: ['', Validators.required],
      files: [''],
    });

    this.form.patchValue({ tender_id: this.data.id });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  searchOccurrence(): void {
    this._occurrencesService.search(this.pageControl)
    .subscribe((occurrences) => {
      this.occurrences = occurrences.data;

      this.pageControl.page = occurrences.current_page - 1;
      this.pageControl.itemCount = occurrences.total;
      this.pageControl.pageCount = occurrences.last_page;
     });
  }

  newOccurrence(){
    this.PageNewOccurrence = !this.PageNewOccurrence
    this.filesToSend = [];
    this.filesToRemove = [];
    this.filesFromBack = [];
    this.form.patchValue({ tender_id: this.data.id });
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
    formData.append('tender_id', this.form.get('tender_id').value);

    let tender_files: File[] = [];
    for (let file of this.filesToSend) {
      tender_files.push(file.file);
    }

    tender_files?.forEach((element, index) => {
      formData.append(`files[${index}]`, element);
    });

    this._tenderOccurence.create(formData)
      .subscribe({
        next : (res) => {
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
