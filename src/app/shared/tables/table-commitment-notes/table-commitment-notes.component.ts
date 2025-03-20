import {Component} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Order, PageControl} from "@models/application";

@Component({
  selector: 'app-table-commitment-notes',
  templateUrl: './table-commitment-notes.component.html',
  styleUrl: './table-commitment-notes.component.scss'
})
export class TableCommitmentNotesComponent {
  displayedColumns: string[] = ['noteNumber', 'receivedDate', 'deliveryDeadline', 'products', 'total', 'status', 'actions'];
  dataSource = new MatTableDataSource([
    {
      id: 1,
      noteNumber: 'NE001',
      receivedDate: '01/03/2025',
      deliveryDeadline: '10/03/2025',
      products: 'Produto A, Produto B',
      total: 500.0,
      status: 'Em Aberto'
    },
    {
      id: 2,
      noteNumber: 'NE002',
      receivedDate: '05/03/2025',
      deliveryDeadline: '15/03/2025',
      products: 'Produto C',
      total: 120.0,
      status: 'Finalizado'
    },
    {
      id: 3,
      noteNumber: 'NE003',
      receivedDate: '07/03/2025',
      deliveryDeadline: '20/03/2025',
      products: 'Produto A, Produto D',
      total: 450.0,
      status: 'Em Aberto'
    },
    {
      id: 4,
      noteNumber: 'NE004',
      receivedDate: '10/03/2025',
      deliveryDeadline: '25/03/2025',
      products: 'Produto B',
      total: 300.0,
      status: 'Cancelado'
    },
  ]);

  public pageControl: PageControl = {
    take: 10,
    page: 1,
    itemCount: 0,
    pageCount: 0,
    orderField: "id",
    order: Order.ASC,
  };

  pageEvent($event: any) {
    this.pageControl.page = $event.pageIndex + 1;
    this.pageControl.take = $event.pageSize;
  }

  handleEdit(id: number) {
    alert(`Editar Nota ${id}`);
  }

  handleDelete(id: number) {
    alert(`Excluir Nota ${id}`);
  }

  handleMarkComplete(id: number) {
    alert(`Marcar Nota ${id} como Finalizada`);
  }

  handleDetails(id: number) {
    alert(`Detalhar Nota ${id}`);
  }
}
