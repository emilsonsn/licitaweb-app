// layout-private.component.ts
import {Component, ElementRef, Renderer2} from '@angular/core';
import {IMenuItem} from "@models/ItemsMenu";
import {SidebarService} from '@services/sidebar.service';
import {Subscription} from "rxjs";
import {User} from "@models/user";
import {UserService} from "@services/user.service";
import {SessionService} from '@store/session.service';
import {SessionQuery} from '@store/session.query';

@Component({
  selector: 'app-layout-private',
  templateUrl: './layout-private.component.html',
  styleUrl: './layout-private.component.scss'
})
export class LayoutPrivateComponent {

  public permitedMenuItem: IMenuItem[] = [];

  public menuItem: IMenuItem[] = [
    {
      label: 'Home',
      icon: 'fa-solid fa-house',
      route: '/painel/home',
    },
    {
      label: 'Editais',
      icon: 'fa-solid fa-landmark',
      route: null,
      children: [
        {
          label: 'Buscar editais',
          icon: 'fa-solid fa-magnifying-glass',
          route: '/painel/tender/search'
        },
        {
          label: 'Modalidade',
          icon: 'fa-solid fa-sheet-plastic',
          route: '/painel/tender/modality'
        },
        {
          label: 'Editais',
          icon: 'fa-solid fa-clipboard-list',
          route: '/painel/tender'
        },
        {
          label: 'Tarefas',
          icon: 'fa-solid fa-calendar-days',
          route: '/painel/tender/task'
        },
      ]
    },
    {
      label: 'Usuários',
      icon: 'fa-solid fa-users',
      route: '/painel/users'
    },
    {
      label: 'Contratos',
      icon: 'fa-solid fa-file-contract',
      route: '/painel/agreement'
    },
    {
      label: 'Clientes',
      icon: 'fa-solid fa-file-contract',
      route: '/painel/client'
    },
    {
      label: 'Fornecedor',
      icon: 'fa-solid fa-file-contract',
      route: '/painel/supplier'
    },
    {
      label: 'Notificações',
      icon: 'fa-solid fa-bell',
      route: '/painel/notification'
    },
    {
      label: 'Logs',
      icon: 'fa-solid fa-file-lines',
      route: '/painel/logs'
    },
/*    {
      label: 'Tarefas',
      icon: 'fa-solid fa-tasks',
      route: '/painel/tasks'
    },*/
  /*  {
      label: 'Configuração',
      icon: 'fa-solid fa-gear',
      route: '/painel/settings'
    },*/
    /*    {
          label: 'Pedidos',
          icon: 'fa-solid fa-box',
          route: '/painel/orders'
        },
        {
          label: 'Solicitações',
          icon: 'fa-solid fa-bookmark',
          route: '/painel/requests'
        },
        {
          label: 'Colaboradores',
          icon: 'fa-solid fa-users',
          route: '/painel/collaborator'
        },
        {
          label: 'Fornecedores',
          icon: 'fa-solid fa-truck',
          route: '/painel/provider'
        },
        {
          label: 'Obras',
          icon: 'fa-solid fa-person-digging',
          route: '/painel/construction'
        },
        {
          label: 'Clientes/Contratantes',
          icon: 'fa-solid fa-user-tie',
          route: '/painel/client'
        },
        {
          label: 'Serviços',
          icon: 'fa-solid fa-tools',
          route: '/painel/services'
        },
        {
          label: 'Tarefas',
          icon: 'fa-solid fa-tasks',
          route: '/painel/tasks'
        }*/
  ];

  protected isMobile: boolean = window.innerWidth >= 1000;
  private resizeSubscription: Subscription;
  user: User;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private readonly _sidebarService: SidebarService,
    private readonly _userService: UserService,
    private readonly _sessionService: SessionService,
    private readonly _sessionQuery: SessionQuery
  ) {
  }

  ngOnInit(): void {
    document.getElementById('template').addEventListener('click', () => {
      this._sidebarService.retractSidebar();
    });

    this._sessionQuery.user$.subscribe(user => {
      if (user) {
        this.user = user;
        /*if (user?.company_position.position == 'Requester')
          this.permitedMenuItem = this.menuItem.filter(item =>
            item.label == 'Pedidos' ||
            item.label == 'Solicitações' ||
            item.label == 'Fornecedores'
          );
        else
          this.permitedMenuItem = this.menuItem;*/
      }
    })
  }

  ngOnDestroy(): void {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
}
