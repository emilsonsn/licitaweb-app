import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export interface FileInput {
  id: number;
  preview: string;
  file: File;
}

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.scss',
})
export class FileInputComponent {
  protected filesToSend: FileInput[] = [];

  protected allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word (.docx)
    'application/msword', // Word (.doc)
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (.xlsx)
    'application/vnd.ms-excel', // Excel (.xls)
  ];

  @Output()
  protected sendFile = new EventEmitter<FileInput>();

  @Output()
  protected cancelSendFile = new EventEmitter<{file : FileInput, index : number}>();

  constructor(private readonly _toastr: ToastrService) {}

  protected removeFile(file : FileInput, index : number) {
    this.filesToSend.splice(index, 1);
    this.cancelSendFile.emit({file, index});
  }

  protected async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement

    const files: FileList = input.files;
    const fileArray: File[] = Array.from(files);

    for (const file of fileArray) {
      if (this.allowedTypes.includes(file.type)) {
        let base64: string;

        if (file.type.startsWith('image/')) {
          base64 = await this.fileToBase64(file);
        }

        let newFile = {
          id: this.filesToSend.length + 1,
          preview: base64,
          file: file,
        };

        this.filesToSend.push(newFile);
        this.sendFile.emit(newFile);
      } else this._toastr.error(`${file.type} não é permitido`);
    }
  }

  public async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
}
