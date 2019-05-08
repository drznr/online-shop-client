import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json"
  })
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  baseURL: string = '/api/shop/orders/';

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<any> {
     return this.http.get(this.baseURL);
  }
  getOrdersByDate(date): Observable<any> {
    return this.http.get(this.baseURL + date);
 }
 getUserOrders(userID): Observable<any> {
  return this.http.get(this.baseURL + 'user/' + userID);
}
 saveNewOrder(ord): Observable<any> {
   return this.http.post(this.baseURL, ord, httpOptions);
 }

 printReceipt(details): Observable<any> {
   return this.http.post(this.baseURL + 'receipt', details, httpOptions);
 }

}
