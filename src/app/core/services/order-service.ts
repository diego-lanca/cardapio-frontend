import { Injectable } from '@angular/core';
import { Order } from '../../shared/models/order';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiUrl + '/orders');
      }
}
