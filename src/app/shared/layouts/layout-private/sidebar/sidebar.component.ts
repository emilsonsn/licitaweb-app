import {Component, Input} from '@angular/core';
import {IMenuItem} from "@models/ItemsMenu";
import {SidebarService} from '@services/sidebar.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() menuItem: IMenuItem[] = []

  constructor(
    protected readonly _sidebarService: SidebarService,
    protected readonly router: Router
  ) {
  }

  public toggleShowSidebar() {
    this._sidebarService.showSidebar.set(false);
  }

  public toggleDropdown(item: IMenuItem): void {
    item.isOpen = !item.isOpen;
  }

  public navigateToRoute(route: string | undefined, event?: Event): void {
    event.stopPropagation();

    if (route) {
      this.router.navigate([route]).then();
    }
  }
}
