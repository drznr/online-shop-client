import { Injectable, EventEmitter } from '@angular/core';
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
export class CartsService {

  constructor(private http: HttpClient) { }
  baseURL: string = '/api/shop/';

  openCartEventEmitter: EventEmitter<boolean> = new EventEmitter();

  checkOpenCart(): Observable<any> {
   return this.http.get(this.baseURL + 'carts/');
  }
  openNewCart(): Observable<any> {
    return this.http.post(this.baseURL + 'carts/', httpOptions);
  }
  clearCart(cartId) : Observable<any> {
    return this.http.delete(this.baseURL + 'carts/' + cartId, httpOptions);
  }
  addCartItem(item): Observable<any> {
    return this.http.post(this.baseURL + 'cartitems/', item, httpOptions);
  }
  checkCartItems(cartId): Observable<any> {
    return this.http.get(this.baseURL + 'cartitems/' + cartId);
  }
  removeCartItem(itemId) : Observable<any> {
    return this.http.delete(this.baseURL + 'cartitems/' + itemId, httpOptions);
  }
 
}
