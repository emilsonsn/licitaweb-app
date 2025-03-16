import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ClientLogService} from '@services/client-log.service';

@Component({
  selector: 'app-dialog-client-log',
  templateUrl: './dialog-client-log.component.html',
  styleUrls: ['./dialog-client-log.component.scss']
})
export class DialogClientLogComponent implements OnInit {
  logs: any[] = [];
  displayedColumns: string[] = ['date', 'description', 'user', 'view_request'];
  totalItems: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  showJson: boolean = false;
  currentRequest: any = null;


  public columns = [
    {
      slug: "date",
      order: true,
      title: "Data",
      align: "start",
    },
    {
      slug: "description",
      order: true,
      title: "Descrição",
      align: "justify-content-center",
    },
    {
      slug: "user",
      order: true,
      title: "Usuário",
      align: "justify-content-center",
    },
    {
      slug: "view_request",
      order: true,
      title: "Ação",
      align: "justify-content-center",
    },
  ];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientLogService: ClientLogService,
    public dialogRef: MatDialogRef<DialogClientLogComponent>
  ) {
  }

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(page: number = 1): void {
    this.clientLogService.getHistoricalClient({page, take: this.pageSize}, {client_id: this.data.clientId}).subscribe(
      (response: any) => {
        this.logs = response.data;
        this.totalItems = response.total;
        this.currentPage = response.current_page;
      },
      error => console.error('Erro ao carregar logs', error)
    );
  }

  onPageChange(event: any): void {
    this.loadLogs(event.pageIndex + 1);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  viewRequest(request: string): void {
    this.currentRequest = JSON.parse(request);
    this.showJson = !this.showJson;
  }
}
