import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MenuItem } from '../../shared/models/menuItem';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  newItem(item: MenuItem): Observable<MenuItem> {
    return this.http.post<MenuItem>(this.apiUrl + '/items', item);
  }

  getAll(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl + '/items');
  }

  update(itemId: number, item: Partial<MenuItem>): Observable<MenuItem> {
    return this.http.patch<MenuItem>(this.apiUrl + '/items/' + itemId, item);
  }

  delete(itemId: number): Observable<any> {
    return this.http.delete(this.apiUrl + '/items/' + itemId);
  }
}
