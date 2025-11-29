import { ChangeDetectorRef, Component, effect, inject } from '@angular/core';
import { Order } from '../../shared/models/order';
import { MatDialog } from '@angular/material/dialog';
import {
  faClock,
  faCheck,
  faUtensils,
  faTruck,
  faCheckCircle,
  faTimesCircle,
  faReceipt,
  faMapMarkerAlt,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';
import { OrderService } from '../../core/services/order-service';
import { AuthService } from '../../core/services/auth-service';
import { LoginDialog } from '../../shared/components/login-dialog/login-dialog';

@Component({
  selector: 'app-orders',
  imports: [FaIconComponent, MatProgressSpinnerModule, CurrencyPipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  private auth = inject(AuthService);
  private cdk = inject(ChangeDetectorRef);

  loading = true;
  orders: any[] = [];
  isLoggedIn = false;

  // Ícones
  faClock = faClock;
  faCheck = faCheck;
  faUtensils = faUtensils;
  faTruck = faTruck;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faReceipt = faReceipt;
  faMapMarkerAlt = faMapMarkerAlt;
  faPhone = faPhone;

  // Filtros
  selectedFilter: 'all' | 'active' | 'completed' = 'all';

  constructor(
    private dialog: MatDialog,
    private orderService: OrderService,
  ) {
    effect(() => {
      this.isLoggedIn = this.auth.isAuthenticated();

      if (this.isLoggedIn) {
        this.loadOrders();
      } else {
        this.loading = false;
      }

      this.cdk.markForCheck();
    });
  }

  ngOnInit() {}

  checkAuthentication() {
    this.isLoggedIn = this.auth.isAuthenticated();
    this.cdk.markForCheck();

    if (this.isLoggedIn) {
      this.loadOrders();
    } else {
      this.loading = false;
    }
  }

  openLoginModal() {
    const dialogRef = this.dialog.open(LoginDialog, {
      width: '400px',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Login realizado!');
      }
    });
  }

  loadOrders() {
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = Array.isArray(orders) ? orders : [orders];
        this.loading = false;
        this.cdk.markForCheck();
      },

      error: (err) => {
        this.loading = false;
      },
    });
  }

  get filteredOrders(): Order[] {
    if (this.selectedFilter === 'all') return this.orders;
    if (this.selectedFilter === 'active') {
      return this.orders.filter((o) =>
        ['pending', 'confirmed', 'preparing', 'ready', 'delivering'].includes(o.status),
      );
    }
    return this.orders.filter((o) => ['delivered', 'cancelled'].includes(o.status));
  }

  setFilter(filter: 'all' | 'active' | 'completed') {
    this.selectedFilter = filter;
  }

  getStatusInfo(status: Order['status']): { label: string; color: string; icon: any } {
    const statusMap: Record<Order['status'], { label: string; color: string; icon: any }> = {
      pending: { label: 'Pendente', color: '#f59e0b', icon: faClock },
      confirmed: { label: 'Confirmado', color: '#3b82f6', icon: faCheck },
      preparing: { label: 'Preparando', color: '#8b5cf6', icon: faUtensils },
      ready: { label: 'Pronto', color: '#10b981', icon: faCheckCircle },
      delivering: { label: 'Saiu para entrega', color: '#06b6d4', icon: faTruck },
      delivered: { label: 'Entregue', color: '#22c55e', icon: faCheckCircle },
      cancelled: { label: 'Cancelado', color: '#ef4444', icon: faTimesCircle },
    };
    return statusMap[status];
  }

  getTimeAgo(date: Date | string): string {
    const now = new Date();
    const timeDate = date instanceof Date ? date : new Date(date);

    const diffMs = now.getTime() - timeDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
    if (diffHours > 0) return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
    if (diffMins > 0) return `${diffMins} min atrás`;
    return 'Agora mesmo';
  }

  openOrderDetails(order: Order) {
    // Implementar dialog de detalhes
    console.log('Abrir detalhes do pedido:', order);
  }

  trackOrder(order: Order) {
    // Implementar rastreamento
    console.log('Rastrear pedido:', order);
  }

  reorder(order: Order) {
    // Implementar re-pedido
    console.log('Fazer pedido novamente:', order);
  }
}
