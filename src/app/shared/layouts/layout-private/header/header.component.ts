import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {IMenuItem} from "@models/ItemsMenu";
import {SidebarService} from '@services/sidebar.service';
import {User} from "@models/user";
import {AuthService} from "@services/auth.service";
import {SessionService} from '@store/session.service';
import {SessionQuery} from '@store/session.query';
import {INotificationItem, NotificationStatus} from "@models/INotificationItem";
import {NotificationService} from "@services/notification.service";

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

  itemsNotifications: INotificationItem[];

  getUnreadNotifications(): INotificationItem[] {
    return this.itemsNotifications?.filter((item) => item.status === NotificationStatus.UNREAD) || [];
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
    private readonly _sessionQuery: SessionQuery,
    private readonly _notificationService: NotificationService
  ) {
    const pollingInterval = 60000; // 1 minuto fixo

    this.fetchNotifications();

    // Inicia o polling
    setInterval(() => this.fetchNotifications(), pollingInterval);
  }

  private fetchNotifications() {
    // Certificando-se de que itemsNotifications é um array válido
    if (!this.itemsNotifications) {
      this.itemsNotifications = [];
    }

    this._notificationService.search(null, {
      viewed: 0
    }).subscribe({
      next: (res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          res.data.forEach((item: any) => {
            const existingNotification = this.itemsNotifications.find(
              (n) => n.id === item.id
            );

            if (existingNotification) {
              // Atualiza o status se mudou
              const newStatus = item.viewed ? NotificationStatus.READ : NotificationStatus.UNREAD;
              if (existingNotification.status !== newStatus) {
                existingNotification.status = newStatus;
              }
            } else {
              // Adiciona nova notificação se não existir
              this.itemsNotifications.push({
                status: item.viewed ? NotificationStatus.READ : NotificationStatus.UNREAD,
                id: item.id,
                title: item.description,
                body: item.message,
                date: item.datetime,
              });
            }
          });
        }
      },
      error: (error) => {
        console.error('Erro ao buscar notificações:', error);
      },
    });
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
