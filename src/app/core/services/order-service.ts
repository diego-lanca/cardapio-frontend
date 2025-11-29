import { Injectable } from '@angular/core';
import { NewOrder, Order } from '../../shared/models/order';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartItem } from '../../shared/models/cartItem';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl + '/orders');
  }

  getUserOrders(): Observable<Order[]> {
    const user = this.auth.user();

    if (!user) {
      return of([]); // retorna lista vazia, evita crash
    }

    const params = new HttpParams().set('user_id', user.id);

    return this.http.get<Order[]>(`${this.apiUrl}/orders`, { params });
  }

  createOrder(newOrder: NewOrder) {
    return this.http.post<Order>(this.apiUrl + '/orders', newOrder);
  }

  updateOrder(order_id: number, status: string): Observable<Order> {
    return this.http.patch<Order>(this.apiUrl + '/orders/' + order_id, {
      status: status,
    });
  }
}
