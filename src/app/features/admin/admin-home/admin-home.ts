import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faBellConcierge,
  faBox,
  faChartBar,
  faCheckCircle,
  faChevronRight,
  faList,
  faPlus,
  faPlusCircle,
  faTachographDigital,
  faUserCheck,
  faUsers,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';
import { ItemService } from '../../../core/services/item-service';
import { firstValueFrom, Observable } from 'rxjs';
import { MenuItem } from '../../../shared/models/menuItem';
import { User } from '../../../shared/models/user';
import { Order } from '../../../shared/models/order';
import { UserService } from '../../../core/services/user-service';
import { OrderService } from '../../../core/services/order-service';

@Component({
  selector: 'app-admin-home',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, FaIconComponent],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css',
})
export class AdminHome implements OnInit {
  faUtensils = faUtensils;
  faList = faList;
  faPlus = faPlus;
  faPlusCircle = faPlusCircle;
  faUsers = faUsers;
  faChartBar = faChartBar;
  faUserCheck = faUserCheck;
  faCheckCircle = faCheckCircle;
  faChevronRight = faChevronRight;
  faTachographDigital = faTachographDigital;
  faBox = faBox;
  faBell = faBellConcierge;

  totalItems = 0;
  activeUsers = 0;
  orderCount = 0;

  constructor(
    private itemService: ItemService,
    private userService: UserService,
    private orderService: OrderService,
    private cdk: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllData()
  }

  async loadAllData() {
    const [totalItems, activeUsers, orders] = await Promise.all([
      this.getTotalItems(),
      this.getActiveUsers(),
      this.getOrderCount(),
    ]);

    this.totalItems = totalItems.length;
    this.activeUsers = activeUsers.length;
    this.orderCount = orders.length;

    this.cdk.markForCheck();
  }

  async getTotalItems(): Promise<MenuItem[]> {
    return await firstValueFrom(this.itemService.getAll());
  }

  async getActiveUsers(): Promise<User[]> {
    return await firstValueFrom(this.userService.getAll());
  }

  async getOrderCount(): Promise<Order[]> {
    return await firstValueFrom(this.orderService.getAll());
  }
}
