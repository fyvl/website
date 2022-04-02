import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {OrderService} from "./order.service";
import {environment} from "../../environments/environment";
import {CartModelPublic, CartModelServer} from "../models/cart.model";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {ProductModelServer} from "../models/product.model";
import {ProductService} from "./product.service";

@Injectable({
  providedIn: 'root'
})
export class CartService {
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

  /* OBSERVABLES FOR THE COMPONENTS */
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartServerData);

  constructor(private http: HttpClient,
              private productService: ProductService,
              private orderService: OrderService,
              private router: Router) {

    this.cartTotal$.next(this.cartServerData.total);
    this.cartData$.next(this.cartServerData);

    // Get the information from local storage
    let info: CartModelPublic = JSON.parse(localStorage.getItem('cart') || '{}');

    // Check if the info variable is empty (null)
    if (info !== null && info !== undefined && info.prodData[0].inCart !== 0) {
      // Local storage is not empty and has some information
      this.cartClientData = info;

      // Loop through each entry and put it in the cartServerData object
      this.cartClientData.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) => {
          if (this.cartServerData.data[0].numInCart == 0) {
            this.cartServerData.data[0].numInCart = p.inCart;
            this.cartServerData.data[0].product = actualProductInfo;
            // todo total calculation
            this.cartClientData.total = this.cartServerData.total;
            localStorage.setItem('cart', JSON.stringify(this.cartClientData));
          }
          else {
            this.cartServerData.data.push({
              numInCart: p.inCart,
              product: actualProductInfo
            });
            // todo total calculation
            this.cartClientData.total = this.cartServerData.total;
            localStorage.setItem('cart', JSON.stringify(this.cartClientData));
          }
          this.cartData$.next({...this.cartServerData});
        })
      });
    }

  }


}
