import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {TableOrdersComponent} from './table-orders/table-orders.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRippleModule} from '@angular/material/core';
import {PipesModule} from '@shared/pipes/pipes.module';
import {TableProviderComponent} from './table-provider/table-provider.component';
import {TableServiceComponent} from './table-service/table-service.component';
import {TableConstructionComponent} from './table-construction/table-construction.component';
import {TableClientComponent} from './table-client/table-client.component';
import {TableTypeProviderComponent} from './table-type-provider/table-type-provider.component';
import {TableTypeServiceComponent} from './table-type-service/table-type-service.component';
import {TableTypeUserSectorComponent} from './table-type-user-sector/table-type-user-sector.component';
import {TableUserComponent} from './table-users/table-users.component';
import {AvatarModule} from "@shared/components/avatar/avatar.module";
import {TableModalityComponent} from './table-modality/table-modality.component';
import {TableTenderComponent} from './table-tender/table-tender.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableLogComponent } from './table-log/table-log.component';
import { TableNotificationComponent } from './table-notification/table-notification.component';
import { TableSupplierComponent } from './table-supplier/table-supplier.component';
import { TableProductComponent } from './table-product/table-product.component';
import { TableTenderAuctionedComponent } from './table-tender-auctioned/table-tender-auctioned.component';
import { TableHistoricalProductComponent } from './table-historical-product/table-historical-product.component';
import { TableContractsComponent } from './table-contracts/table-contracts.component';

const tables = [
  TableOrdersComponent,
  TableProviderComponent,
  TableServiceComponent,
  TableClientComponent,
  TableConstructionComponent,
  TableTypeProviderComponent,
  TableTypeProviderComponent,
  TableTypeServiceComponent,
  TableUserComponent,
  TableTypeUserSectorComponent,
  TableModalityComponent,
  TableTenderComponent,
  TableNotificationComponent,
  TableSupplierComponent,
  TableProductComponent,
  TableHistoricalProductComponent
]

@NgModule({
  declarations: [
    tables,
    TableLogComponent,
    TableTenderAuctionedComponent,
    TableContractsComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatIconButton,
    MatMenuModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    PipesModule,
    AvatarModule,
    MatTooltipModule
  ],
  exports: [
    tables,
    TableLogComponent,
    TableTenderAuctionedComponent,
    TableContractsComponent
  ],
})
export class TablesModule {
}
