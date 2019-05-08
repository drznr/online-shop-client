import { Injectable } from '@angular/core';
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
export class ProductsService {

  constructor(private http: HttpClient) { }
  baseURL: string = '/api/shop/products/';
  getCategories():Observable<any> {
    return this.http.get('/api/shop/categories');
  }
  searchCategory(name):Observable<any> {
    return this.http.get('/api/shop/categories/' + name);
  }
  addNewCategory(catg):Observable<any> {
    return this.http.post('/api/shop/categories', catg, httpOptions);
  }
  getProducts():Observable<any> {
      return this.http.get(this.baseURL);
  }
  getProductByCategories(catg):Observable<any> {
    return this.http.get(this.baseURL + catg);
  }
  getProductByName(name):Observable<any> {
    return this.http.get('/api/shop/search/' + name);
  }
  saveNewProduct(prod):Observable<any> {
    return this.http.post(this.baseURL, prod, httpOptions);
  }
  updateProduct(prodId, prod):Observable<any> {
    return this.http.put(this.baseURL + prodId, prod, httpOptions);
  }
}
