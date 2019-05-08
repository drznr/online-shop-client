import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  userNameEventEmitter: EventEmitter<string> = new EventEmitter();
  userLogOutEventEmitter: EventEmitter<boolean> = new EventEmitter(); 
  userLoginEventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) { }


  login(data): Observable<any> {
    return this.http.post('/api/login/', data, httpOptions);
  }
  checkSession(): Observable<any> {
    return this.http.get('/api/login/');
  }
  logOut(): Observable<any> {
    return this.http.get('/api/logout/');
  }
  checkIdAvailable(id): Observable<any> {
    return this.http.get('/api/register/' + id);
  }
  registerNewUser(userObj): Observable<any> {
    return this.http.post('/api/register/', userObj, httpOptions);
  }
}
