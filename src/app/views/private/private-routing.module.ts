import { AgreementModule } from './agreement/agreement.module';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutPrivateComponent} from "@shared/layouts/layout-private/layout-private.component";
import {SessionService} from '@store/session.service';
import {permissionGuard} from '@app/guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutPrivateComponent,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        canActivate: [permissionGuard],
        data: {
          page: 'home'
        }
      },
      {
        path: 'tender',
        loadChildren: () => import('./tender/tender.module').then(m => m.TenderModule),
        canActivate: [permissionGuard],
        data: {
          page: 'tender'
        }
      },
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
        canActivate: [permissionGuard],
        data: {
          page: 'product'
        }
      },
      {
        path: 'users',
        loadChildren: () => import('./collaborator/collaborator.module').then(m => m.CollaboratorModule),
        canActivate: [permissionGuard],
        data: {
          page: 'users'
        }
      },
      {
        path: 'agreement',
        loadChildren: () => import('./agreement/agreement.module').then(m => m.AgreementModule),
        canActivate: [permissionGuard],
        data: {
          page: 'agreement'
        }
      },
      {
        path: 'client',
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
        canActivate: [permissionGuard],
        data: {
          page: 'client'
        }
      },
      {
        path: 'supplier',
        loadChildren: () => import('./supplier/supplier.module').then(m => m.SupplierModule),
        canActivate: [permissionGuard],
        data: {
          page: 'supplier'
        }
      },
      {
        path: 'notification',
        loadChildren: () => import('./notification/notification.module').then(m => m.NotificationModule),
        canActivate: [permissionGuard],
        data: {
          page: 'notification'
        }
      },
      {
        path: 'logs',
        loadChildren: () => import('./logs/logs.module').then(m => m.LogsModule),
        canActivate: [permissionGuard],
        data: {
          page: 'logs'
        }
      },
 /*     {
        path: "settings",
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
        canActivate: [permissionGuard],
        data: {
          page: 'settings'
        }
      },*/
      {
        path: '**',
        redirectTo: 'home',
        canMatch: []
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule {

  constructor(
    private readonly _sessionService: SessionService
  ) {
  }

}




