import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Estados from '../../../../assets/json/Estados.json';
import Cidades from '../../../../assets/json/Cidades.json';
import {FiltersService} from '@services/filters-service.service';

@Component({
  selector: 'app-card-tender-filter',
  templateUrl: './card-tender-filter.component.html',
  styleUrl: './card-tender-filter.component.scss'
})
export class CardTenderFilterComponent {

  form: FormGroup;
  estados: any[] = Estados;
  cidades: any[] = Cidades;
  cidadesFiltradas: any[] = [];

  @Output()
  onSearch : EventEmitter<any> = new EventEmitter();

  @Output()
  onReset : EventEmitter<any> = new EventEmitter();

  constructor(
      private fb: FormBuilder,
      private filtersService: FiltersService
    ) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      object: [''], // Campo texto sem validação obrigatória
      uf: [''], // Select sem validação obrigatória
      city: [''], // Select sem validação obrigatória
      modality_ids: [''], // Select sem validação obrigatória
      update_date_start: [''], // Data inicial
      update_date_end: [''], // Data final
      organ_cnpj: ['', [Validators.pattern(/^\d{14}$/)]], // Validação para CNPJ (14 dígitos)
      organ_name: [''], // Campo texto sem validação obrigatória
      process: [''], // Campo texto sem validação obrigatória
    });

    this.cidadesFiltradas = [];
    const savedFilters = this.filtersService.getFilters('Search');
    setTimeout(() => {
      if (savedFilters) {
        this.onStateChange(savedFilters.uf);
        this.form.patchValue(savedFilters);
      }
    }, 100);
  }

  onStateChange(estadoSigla: string): void {
    const estadoSelecionado = this.estados.find(estado => estado.Sigla === estadoSigla);
    if (estadoSelecionado) {
      this.cidadesFiltradas = this.cidades.filter(cidade => cidade.Estado === estadoSelecionado.ID);
      this.form.get('city')?.setValue(''); // Reseta o campo cidade
    }
  }

  search(){
    this.onSearch.emit(
      {
        ...this.form.getRawValue(),
        update_date_start: this.form.get('update_date_start').value? this.form.get('update_date_start').value.toISOString().split('T')[0] : '',
        update_date_end: this.form.get('update_date_end').value? this.form.get('update_date_end').value.toISOString().split('T')[0] : '',
      }
    )
    this.filtersService.setFilters(this.form.value, 'Search');
  }

  clear() {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.setValue('');
    });
    this.cidadesFiltradas = [];
    this.filtersService.setFilters(null, 'Search');
    this.onReset.emit();
  }
}
