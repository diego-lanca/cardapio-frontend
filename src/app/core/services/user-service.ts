import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../../shared/models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl + '/user');
  }

  getUser(user_id: number): Observable<User> {
    return this.http.get<User>(this.apiUrl + '/user/' + user_id);
  }

  updateUser(user_id: number, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(this.apiUrl + '/user/' + user_id, user);
  }

  deleteUser(user_id: number): Observable<any> {
    return this.http.delete(this.apiUrl + '/user/' + user_id);
  }
}
