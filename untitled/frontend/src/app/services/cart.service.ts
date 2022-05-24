import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {OrderService} from "./order.service";
import {environment} from "../../environments/environment";
import {CartModelPublic, CartModelServer} from "../models/cart.model";
import {BehaviorSubject} from "rxjs";
import {NavigationExtras, Router} from "@angular/router";
import {ProductModelServer} from "../models/product.model";
import {ProductService} from "./product.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";

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
              private router: Router,
              private toast: ToastrService,
              private spinner: NgxSpinnerService) {

    this.cartTotal$.next(this.cartServerData.total);
    this.cartData$.next(this.cartServerData);

    // Get the information from local storage
    const info: CartModelPublic = JSON.parse(localStorage.getItem('cart') || '{}');

    // Check if the info variable is empty (null)
    if (info.prodData == undefined || info.prodData == null || info.prodData[0].inCart == 0) {}
    else {
      // Local storage is not empty and has some information
      this.cartClientData = info;

      // Loop through each entry and put it in the cartServerData object
      this.cartClientData.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) => {
          if (this.cartServerData.data[0].numInCart == 0) {
            this.cartServerData.data[0].numInCart = p.inCart;
            this.cartServerData.data[0].product = actualProductInfo;
            this.CalculateTotal();
            this.cartClientData.total = this.cartServerData.total;
            localStorage.setItem('cart', JSON.stringify(this.cartClientData));
          } else {
            this.cartServerData.data.push({
              numInCart: p.inCart,
              product: actualProductInfo
            });
            this.CalculateTotal();
            this.cartClientData.total = this.cartServerData.total;
            localStorage.setItem('cart', JSON.stringify(this.cartClientData));
          }
          this.cartData$.next({...this.cartServerData});
        })
      });
    }
  }

  AddProductToCart(id: number, quantity?: number) {
    this.productService.getSingleProduct(id).subscribe(prod => {
      // IF the cart is empty
      if (this.cartServerData.data[0].product == undefined) {
        this.cartServerData.data[0].product = prod;
        this.cartServerData.data[0].numInCart = quantity !== undefined ? quantity : 1;
        this.CalculateTotal();
        this.cartClientData.prodData[0].inCart = this.cartServerData.data[0].numInCart;
        this.cartClientData.prodData[0].id = prod.id;
        this.cartClientData.total = this.cartServerData.total;
        localStorage.setItem('cart', JSON.stringify(this.cartClientData));
        this.cartData$.next({...this.cartServerData});
        this.toast.success(`${prod.name} добавлен в корзину`, 'Товар добавлен', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
      }
      // IF the cart is NOT empty
      else {
        let index = this.cartServerData.data.findIndex(p => p.product.id == prod.id); // -1 or +value

        // if the item is already in the cart => index is +value
        if (index !== -1) {
          if (quantity !== undefined && quantity <= prod.quantity) {
            this.cartServerData.data[index].numInCart = this.cartServerData.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
          } else {
            this.cartServerData.data[index].numInCart < prod.quantity ? this.cartServerData.data[index].numInCart++ : prod.quantity;
          }

          this.cartClientData.prodData[index].inCart = this.cartServerData.data[index].numInCart;
          this.CalculateTotal();
          this.cartClientData.total = this.cartServerData.total;
          localStorage.setItem('cart', JSON.stringify(this.cartClientData));
          this.toast.info(`${prod.name} кол-во обновлено в корзине`, 'Товар Обновлен', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })
        }
        // if the item is not in the cart => index is -1
        else {
          this.cartServerData.data.push({
            numInCart: 1,
            product: prod
          });

          this.cartClientData.prodData.push({
            inCart: 1,
            id: prod.id
          });

          this.toast.success(`${prod.name} добавлен в корзину`, 'Товар добавлен', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })

          this.CalculateTotal();
          this.cartClientData.total = this.cartServerData.total;
          localStorage.setItem('cart', JSON.stringify(this.cartClientData));
          this.cartData$.next({...this.cartServerData});
        }
      }
    });
  }

  UpdateCartItems(index: number, increase: boolean) {
    let data = this.cartServerData.data[index];

    if (increase) {
      data.numInCart < data.product.quantity ? data.numInCart++ : data.product.quantity;
      this.cartClientData.prodData[index].inCart = data.numInCart;
      this.CalculateTotal();
      this.cartClientData.total = this.cartServerData.total;
      localStorage.setItem('cart', JSON.stringify(this.cartClientData));
      this.cartData$.next({...this.cartServerData});
    } else {
      data.numInCart--;

      if (data.numInCart < 1) {
        this.DeleteProductFromCart(index);
        this.cartData$.next({...this.cartServerData});
      } else {
        this.cartData$.next({...this.cartServerData});
        this.cartClientData.prodData[index].inCart = data.numInCart;
        this.CalculateTotal();
        this.cartClientData.total = this.cartServerData.total;
        localStorage.setItem('cart', JSON.stringify(this.cartClientData));
      }
    }
  }

  DeleteProductFromCart(index: number) {
    if (window.confirm('Are you sure you want to delete the item?')) {
      this.cartServerData.data.splice(index, 1);
      this.cartClientData.prodData.splice(index, 1);
      this.CalculateTotal();
      this.cartClientData.total = this.cartServerData.total;

      if (this.cartClientData.total === 0) {
        this.cartClientData = {prodData: [{inCart: 0, id: 0}], total: 0};
        localStorage.setItem('cart', JSON.stringify(this.cartClientData));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartClientData));
      }

      if (this.cartServerData.total === 0) {
        this.cartServerData = {data: [{product: undefined!, numInCart: 0}], total: 0};
        this.cartData$.next({...this.cartServerData});
      } else {
        this.cartData$.next({...this.cartServerData});
      }
    }
    // If the user doesn't want to delete the product, hits the CANCEL button
    else {
      return;
    }
  }

  CheckoutFromCart(userId: Number) {
    this.http.post<OrderConfirmationResponse>(`${this.serverUrl}/orders/payment`, null).subscribe((res: { success: boolean }) => {
      if (res.success) {

        this.resetServerData();
        this.http.post<OrderConfirmationResponse>(`${this.serverUrl}/orders/new`, {
          userId: userId,
          products: this.cartClientData.prodData
        }).subscribe((data: OrderConfirmationResponse) => {

          this.orderService.getSingleOrder(data.order_id).then(prods => {
            if (data.success) {
              const navigationExtras: NavigationExtras = {
                state: {
                  message: data.message,
                  products: prods,
                  orderId: data.order_id,
                  total: this.cartClientData.total
                }
              };
              this.spinner.hide().then();
              this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                this.cartClientData = {prodData: [{inCart: 0, id: 0}], total: 0};
                this.cartTotal$.next(0);
                localStorage.setItem('cart', JSON.stringify(this.cartClientData));
              });
            }
          });
        });
      } else {
        this.spinner.hide().then();
        this.router.navigateByUrl('/checkout').then();
        this.toast.error(`Sorry, failed to book the order`, 'Order Status', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
      }
    });
  }

  private CalculateTotal() {
    let Total = 0;

    this.cartServerData.data.forEach(p => {
      const {numInCart} = p;
      const {price} = p.product;

      Total += numInCart * price;
    });
    this.cartServerData.total = Total;
    this.cartTotal$.next(this.cartServerData.total);
  }

  private resetServerData() {
    this.cartServerData = {
      data: [{
        product: undefined!,
        numInCart: 0
      }],
      total: 0
    };
    this.cartData$.next({...this.cartServerData});
  }

  CalculateSubTotal(index: number) {
    let subTotal = 0;

    const p = this.cartServerData.data[index];
    subTotal = p.product.price * p.numInCart;

    return subTotal;
  }
}

interface OrderConfirmationResponse {
  order_id: number;
  success: boolean;
  message: string;
  products: [{
    id: string,
    numInCart: string
  }]
}
