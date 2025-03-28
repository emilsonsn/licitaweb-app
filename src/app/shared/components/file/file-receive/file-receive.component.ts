import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface FileReceive {
  index: number;
  id: number;
  name: string;
  path: string;
}

@Component({
  selector: 'app-file-receive',
  templateUrl: './file-receive.component.html',
  styleUrl: './file-receive.component.scss',
})
export class FileReceiveComponent {
  @Input()
  public filesFromBack: FileReceive[] = [];

  @Output()
  protected emitFileToRemove = new EventEmitter<FileReceive>();

  protected openImgInAnotherTab(url: string) {
    window.open(url, '_blank');
  }

  protected removeFile(file: FileReceive, index: number) {
    this.filesFromBack.splice(index, 1);
    this.emitFileToRemove.emit(file);
  }

  protected imgLoadError(event: Event, img: any) {
    img.error = true;
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
