import {Component, Input} from '@angular/core';
import dayjs from "dayjs";

@Component({
  selector: 'app-card-tender',
  templateUrl: './card-tender.component.html',
  styleUrl: './card-tender.component.scss'
})
export class CardTenderComponent {
  @Input() tender!: any;

  protected readonly dayjs = dayjs;

  goToOfficialSite(origin_url){
    window.open(origin_url, '_blank');
  }
}
