import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPrivateComponent } from './layout-private/layout-private.component';
import { SidebarComponent } from './layout-private/sidebar/sidebar.component';
import { HeaderComponent } from './layout-private/header/header.component';
import { FooterComponent } from './layout-private/footer/footer.component';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatDivider} from "@angular/material/divider";
import { MatRippleModule } from '@angular/material/core';
import {MatTooltip} from "@angular/material/tooltip";
import {ComponentsModule} from "@shared/components/components.module";
import {MatBadge} from "@angular/material/badge";


@NgModule({
  declarations: [
    LayoutPrivateComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatDivider,
    MatRippleModule,
    RouterLinkActive,
    MatTooltip,
    ComponentsModule,
    MatBadge
  ]
})
export class LayoutsModule { }
