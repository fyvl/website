import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ProductModelServer, serverResponse} from "../models/product.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private serverUrl = environment.SERVER_URL
  constructor(private http: HttpClient) { }

  getAllProducts(numberOfResults = 10): Observable<serverResponse> {
    return this.http.get<serverResponse>(this.serverUrl + '/products', {
      params: {
        limit: numberOfResults.toString()
      }
    });
  }

  /* GET SINGLE PRODUCT FROM SERVER */
  getSingleProduct(id: number): Observable<ProductModelServer> {
    return this.http.get<ProductModelServer>(this.serverUrl + '/products' + id);
  }

  /* GET PRODUCTS FROM SAME CATEGORY */
  getProductsFromCategory(catName: string): Observable<ProductModelServer[]> {
    return this.http.get<ProductModelServer[]>(this.serverUrl + '/products/category/' + catName);
  }
}
