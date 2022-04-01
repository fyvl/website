import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {OrderService} from "./order.service";
import {environment} from "../../environments/environment";
import {CartModelPublic, CartModelServer} from "../models/cart.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private serverUrl = environment.SERVER_URL;

  // Data variable to store the cart information on the client's local storage
  private cartClientData: CartModelPublic = {
    total: 0,
    prodData: [{
      inCart: 0,
      id: 0
    }]
  };

  // Data variable to store the cart information on the server
  private cartServerData: CartModelServer = {
    total: 0,
    data: [{
      numInCart: 0,
      product: undefined!
    }]
  };

  constructor(private http: HttpClient,
              private productService: ProductService,
              private orderService: OrderService) { }


}
