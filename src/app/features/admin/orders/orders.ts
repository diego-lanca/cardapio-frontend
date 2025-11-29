import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
import { OrderService } from '../../../core/services/order-service';
import { UserService } from '../../../core/services/user-service';
import { LoginDialog } from '../../../shared/components/login-dialog/login-dialog';
import { firstValueFrom } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Order } from '../../../shared/models/order';
import { EditOrderDialog } from '../../../shared/components/edit-order-dialog/edit-order-dialog';

export interface UsersOrders {
  order: Order;
  user: any;
}

@Component({
  selector: 'app-orders',
  imports: [FaIconComponent, MatProgressSpinnerModule, CurrencyPipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class AdminOrders {
  private userService = inject(UserService);
  private cdk = inject(ChangeDetectorRef);

  loading = true;

  /** Agora tudo fica aqui */
  usersOrders: UsersOrders[] = [];

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

  selectedFilter: 'all' | 'active' | 'completed' = 'all';

  constructor(
    private dialog: MatDialog,
    private orderService: OrderService,
  ) {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAll().subscribe({
      next: async (orders) => {
        const list = Array.isArray(orders) ? orders : [orders];

        this.usersOrders = await Promise.all(
          list.map(async (order) => {
            const user = await firstValueFrom(this.userService.getUser(order.user_id));
            return { order, user };
          }),
        );

        this.loading = false;
        this.cdk.markForCheck();
      },
      error: () => (this.loading = false),
    });
  }

  openEditOrder(uo: UsersOrders) {
    const dialogRef = this.dialog.open(EditOrderDialog, {
      width: '420px',
      data: {
        order: { ...uo.order },
        user: uo.user,
      },
    });

    dialogRef.afterClosed().subscribe(async (editedOrder) => {
      if (!editedOrder) return;

      try {
        await firstValueFrom(this.orderService.updateOrder(editedOrder.id, editedOrder.status));

        // Atualiza localmente
        const index = this.usersOrders.findIndex((x) => x.order.id === editedOrder.id);
        if (index !== -1) {
          this.usersOrders[index].order = editedOrder;
        }

        this.cdk.markForCheck();
      } catch (e) {
        console.error('Erro ao salvar pedido', e);
      }
    });
  }

  get filteredOrders(): UsersOrders[] {
    if (this.selectedFilter === 'all') return this.usersOrders;

    if (this.selectedFilter === 'active') {
      return this.usersOrders.filter((u) =>
        ['pending', 'confirmed', 'preparing', 'ready', 'delivering'].includes(u.order.status),
      );
    }

    return this.usersOrders.filter((u) => ['delivered', 'cancelled'].includes(u.order.status));
  }

  setFilter(filter: 'all' | 'active' | 'completed') {
    this.selectedFilter = filter;
  }

  getStatusInfo(status: Order['status']) {
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
    const timeDate = new Date(date);
    const diffMs = now.getTime() - timeDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
    if (diffHours > 0) return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
    if (diffMins > 0) return `${diffMins} min atrás`;
    return 'Agora mesmo';
  }
}
