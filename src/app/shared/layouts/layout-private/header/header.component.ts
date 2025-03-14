import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {IMenuItem} from "@models/ItemsMenu";
import {SidebarService} from '@services/sidebar.service';
import {User} from "@models/user";
import {AuthService} from "@services/auth.service";
import {SessionService} from '@store/session.service';
import {SessionQuery} from '@store/session.query';
import {INotificationItem, NotificationStatus} from "@models/INotificationItem";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() menuItem: IMenuItem[] = [];
  activeLabel: string = '';
  show_dropdown = false;
  show_dropdown_notification: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  itemsNotifications: INotificationItem[] = [
    {
      id: 1,
      title: 'Título da notificação 1',
      body: 'Descrição da notificação',
      date: new Date(),
      status: NotificationStatus.UNREAD
    },
    {
      id: 2,
      title: 'Título da notificação 2',
      body: 'Descrição da notificação',
      date: new Date(),
      status: NotificationStatus.UNREAD
    },
    {
      id: 3,
      title: 'Título da notificação 3',
      body: 'Descrição da notificação',
      date: new Date(),
      status: NotificationStatus.UNREAD
    },
    {
      id: 4,
      title: 'Título da notificação 4',
      body: 'Descrição da notificação',
      date: new Date(),
      status: NotificationStatus.UNREAD
    }
  ]

  getUnreadNotifications(): INotificationItem[] {
    return this.itemsNotifications.filter((item) => item.status === NotificationStatus.UNREAD);
  }

  onToggleSidebar() {
    event.stopPropagation();
    this._sidebarService.showSidebar.set(true);
  }

  constructor(
    protected router: Router,
    private readonly _sidebarService: SidebarService,
    private readonly _authService: AuthService,
    private readonly _sessionService: SessionService,
    private readonly _sessionQuery: SessionQuery
  ) {
  }

  ngOnInit() {
    this.updateActiveLabel();
    this.router.events.subscribe(() => {
      this.updateActiveLabel();
    });

    this._sessionService.getUserFromBack().subscribe();

  }

  private updateActiveLabel() {
    const currentUrl = this.router.url;
    const activeItem = this.findActiveItem(this.menuItem, currentUrl);
    this.activeLabel = activeItem ? activeItem.label : '';
  }

  findActiveItem(menuItems: IMenuItem[], currentUrl: string): IMenuItem | undefined {
    for (let item of menuItems) {
      if (item.active && item.label) {
        return item;
      } else if (item.children) {
        const childItem = this.findActiveItem(item.children, currentUrl);
        if (childItem) {
          return childItem;
        }
      }
    }
    return undefined;
  }


  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.show_dropdown = !this.show_dropdown;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown') && this.show_dropdown) {
      this.show_dropdown = false;
    }

    if (!target.closest('.dropdown') && this.show_dropdown_notification) {
      this.show_dropdown_notification = false;
    }
  }

  // Utils
  @Input() user!: User;

  public get isMobile() {
    return this._sidebarService.mobile();
  }

  public get isSidebarOpen() {
    return this._sidebarService.showSidebar();
  }


  logout() {
    this._authService.logout();
  }

  toggleDropdownNotification($event: Event) {
    $event.stopPropagation();
    this.show_dropdown_notification = !this.show_dropdown_notification;
  }
}
