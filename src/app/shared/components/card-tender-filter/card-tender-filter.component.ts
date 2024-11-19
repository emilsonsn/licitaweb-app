import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-card-tender-filter',
  templateUrl: './card-tender-filter.component.html',
  styleUrl: './card-tender-filter.component.scss'
})
export class CardTenderFilterComponent {

  form: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      object: [''], // Campo texto sem validação obrigatória
      state: [''], // Select sem validação obrigatória
      city: [''], // Select sem validação obrigatória
      modalities: [''], // Select sem validação obrigatória
      start_date: [''], // Data inicial
      end_date: [''], // Data final
      organ_cnpj: ['', [Validators.pattern(/^\d{14}$/)]], // Validação para CNPJ (14 dígitos)
      organ_name: [''], // Campo texto sem validação obrigatória
      process: [''], // Campo texto sem validação obrigatória
      observations: [''] // Campo texto sem validação obrigatória
    });
  }
}
