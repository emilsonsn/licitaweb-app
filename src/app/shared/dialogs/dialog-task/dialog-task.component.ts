import {Component, ElementRef, HostListener, Inject, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-task',
  templateUrl: './dialog-task.component.html',
  styleUrls: ['./dialog-task.component.scss']
})
export class DialogTaskComponent {
  statusForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id?: number; name?: string; color?: string } // exemplo de dados esperados
  ) {
  }

  ngOnInit(): void {
    this.statusForm = this.fb.group({
      id: [this.data?.id],
      name: [this.data?.name || '', Validators.required],
      color: [this.data?.color || '#000000', Validators.required] // valor padrão para cor
    });

    if (this.data?.color) {
      this.selectedColor = this.data.color;
    }
  }

  onSubmit(): void {
    if (this.statusForm.valid) {
      this.dialogRef.close(this.statusForm.value); // fecha o modal e envia os dados
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // fecha o modal sem enviar dados
  }

  colorPickerVisible = false;
  selectedColor: string = '#000000'; // Cor padrão

  @ViewChild('colorPicker') colorPicker!: ElementRef;

  toggleColorPicker(event) {
    event.stopPropagation();
    this.colorPickerVisible = !this.colorPickerVisible;
  }

  onColorChange(event: any) {
    this.selectedColor = event.color.hex;
    this.statusForm.get('color')?.setValue(this.selectedColor);
  }

  // Detecta cliques fora do elemento de seletor de cor
  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement): void {
    const clickedInside = this.colorPicker?.nativeElement.contains(targetElement);
    if (!clickedInside && this.colorPickerVisible) {
      this.colorPickerVisible = false;
    }
  }

}
