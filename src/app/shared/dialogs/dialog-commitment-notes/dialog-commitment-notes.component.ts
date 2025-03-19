import {Component, Inject} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-commitment-notes',
  templateUrl: './dialog-commitment-notes.component.html',
  styleUrl: './dialog-commitment-notes.component.scss'
})
export class DialogCommitmentNotesComponent {
  notesForm: FormGroup;
  title: string = 'Cadastro de Nota de Empenho';
  isNew: boolean = true;
  loading: boolean;
  productList = [
    { name: 'Produto A' },
    { name: 'Produto B' },
    { name: 'Produto C' }
  ];


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogCommitmentNotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.notesForm = this.fb.group({
      noteNumber: ['', Validators.required],
      receivedDate: ['', Validators.required],
      deliveryDeadline: ['', Validators.required],
      products: this.fb.array([]),
      status: ['Em Aberto', Validators.required],
      observations: ['']
    });
  }

  get products(): FormArray {
    return this.notesForm.get('products') as FormArray;
  }

  addProduct() {
    const productForm = this.fb.group({
      productName: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0.01)]]
    });
    this.products.push(productForm);
  }

  removeProduct(index: number) {
    this.products.removeAt(index);
  }

  submit() {
    if (this.notesForm.valid) this.dialogRef.close(this.notesForm.value);
  }

  close() {
    this.dialogRef.close();
  }

  quantity: number = 1;

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onQuantityChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.quantity = Math.max(1, Number(value));
  }

}
