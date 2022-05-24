import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FavModelPublic, FavModelServer } from '../models/fav.model';
import { ProductModelServer } from '../models/product.model';
import { OrderService } from './order.service';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class FavService {
  private serverUrl = environment.SERVER_URL;

  // Data variable to store the fav information on the client's local storage
  private favClientData: FavModelPublic = {
    total: 0,
    prodData: [{
      inFav: 0,
      id: 0
    }]
  };

  // Data variable to store the fav information on the server
  private favServerData: FavModelServer = {
    total: 0,
    data: [{
      numInFav: 0,
      product: undefined!
    }]
  };

  /* OBSERVABLES FOR THE COMPONENTS */
  favTotal$ = new BehaviorSubject<number>(0);
  favData$ = new BehaviorSubject<FavModelServer>(this.favServerData);

  constructor(private http: HttpClient,
              private productService: ProductService,
              private orderService: OrderService,
              private router: Router,
              private toast: ToastrService,
              private spinner: NgxSpinnerService) {

    this.favTotal$.next(this.favServerData.total);
    this.favData$.next(this.favServerData);

    // Get the information from local storage
    const info: FavModelPublic = JSON.parse(localStorage.getItem('fav') || '{}');

    // Check if the info variable is empty (null)
    if (info.prodData == undefined || info.prodData == null || info.prodData[0].inFav == 0) {}
    else {
      // Local storage is not empty and has some information
      this.favClientData = info;

      // Loop through each entry and put it in the favServerData object
      this.favClientData.prodData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: ProductModelServer) => {
          if (this.favServerData.data[0].numInFav == 0) {
            this.favServerData.data[0].numInFav = p.inFav;
            this.favServerData.data[0].product = actualProductInfo;
            this.CalculateTotal();
            this.favClientData.total = this.favServerData.total;
            localStorage.setItem('fav', JSON.stringify(this.favClientData));
          } else {
            this.favServerData.data.push({
              numInFav: p.inFav,
              product: actualProductInfo
            });
            this.CalculateTotal();
            this.favClientData.total = this.favServerData.total;
            localStorage.setItem('fav', JSON.stringify(this.favClientData));
          }
          this.favData$.next({...this.favServerData});
        })
      });
    }
  }

  AddProductToFav(id: number, quantity?: number) {
    this.productService.getSingleProduct(id).subscribe(prod => {
      // IF the fav is empty
      if (this.favServerData.data[0].product == undefined) {
        this.favServerData.data[0].product = prod;
        this.favServerData.data[0].numInFav = quantity !== undefined ? quantity : 1;
        this.CalculateTotal();
        this.favClientData.prodData[0].inFav = this.favServerData.data[0].numInFav;
        this.favClientData.prodData[0].id = prod.id;
        this.favClientData.total = this.favServerData.total;
        localStorage.setItem('fav', JSON.stringify(this.favClientData));
        this.favData$.next({...this.favServerData});
        this.toast.success(`${prod.name} добавлен в корзину`, 'Товар добавлен', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
      }
      // IF the fav is NOT empty
      else {
        let index = this.favServerData.data.findIndex(p => p.product.id == prod.id); // -1 or +value

        // if the item is already in the fav => index is +value
        if (index !== -1) {
          if (quantity !== undefined && quantity <= prod.quantity) {
            this.favServerData.data[index].numInFav = this.favServerData.data[index].numInFav < prod.quantity ? quantity : prod.quantity;
          } else {
            this.favServerData.data[index].numInFav < prod.quantity ? this.favServerData.data[index].numInFav++ : prod.quantity;
          }

          this.favClientData.prodData[index].inFav = this.favServerData.data[index].numInFav;
          this.CalculateTotal();
          this.favClientData.total = this.favServerData.total;
          localStorage.setItem('fav', JSON.stringify(this.favClientData));
          this.toast.info(`${prod.name} кол-во обновлено в корзине`, 'Товар Обновлен', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })
        }
        // if the item is not in the fav => index is -1
        else {
          this.favServerData.data.push({
            numInFav: 1,
            product: prod
          });

          this.favClientData.prodData.push({
            inFav: 1,
            id: prod.id
          });

          this.toast.success(`${prod.name} добавлен в корзину`, 'Товар добавлен', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          })

          this.CalculateTotal();
          this.favClientData.total = this.favServerData.total;
          localStorage.setItem('fav', JSON.stringify(this.favClientData));
          this.favData$.next({...this.favServerData});
        }
      }
    });
  }

  UpdateFavItems(index: number, increase: boolean) {
    let data = this.favServerData.data[index];

    if (increase) {
      data.numInFav < data.product.quantity ? data.numInFav++ : data.product.quantity;
      this.favClientData.prodData[index].inFav = data.numInFav;
      this.CalculateTotal();
      this.favClientData.total = this.favServerData.total;
      localStorage.setItem('fav', JSON.stringify(this.favClientData));
      this.favData$.next({...this.favServerData});
    } else {
      data.numInFav--;

      if (data.numInFav < 1) {
        this.DeleteProductFromFav(index);
        this.favData$.next({...this.favServerData});
      } else {
        this.favData$.next({...this.favServerData});
        this.favClientData.prodData[index].inFav = data.numInFav;
        this.CalculateTotal();
        this.favClientData.total = this.favServerData.total;
        localStorage.setItem('fav', JSON.stringify(this.favClientData));
      }
    }
  }

  DeleteProductFromFav(index: number) {
    if (window.confirm('Are you sure you want to delete the item?')) {
      this.favServerData.data.splice(index, 1);
      this.favClientData.prodData.splice(index, 1);
      this.CalculateTotal();
      this.favClientData.total = this.favServerData.total;

      if (this.favClientData.total === 0) {
        this.favClientData = {prodData: [{inFav: 0, id: 0}], total: 0};
        localStorage.setItem('fav', JSON.stringify(this.favClientData));
      } else {
        localStorage.setItem('fav', JSON.stringify(this.favClientData));
      }

      if (this.favServerData.total === 0) {
        this.favServerData = {data: [{product: undefined!, numInFav: 0}], total: 0};
        this.favData$.next({...this.favServerData});
      } else {
        this.favData$.next({...this.favServerData});
      }
    }
    // If the user doesn't want to delete the product, hits the CANCEL button
    else {
      return;
    }
  }

  private CalculateTotal() {
    let Total = 0;

    this.favServerData.data.forEach(p => {
      const {numInFav} = p;
      const {price} = p.product;

      Total += numInFav * price;
    });
    this.favServerData.total = Total;
    this.favTotal$.next(this.favServerData.total);
  }

  CalculateSubTotal(index: number) {
    let subTotal = 0;

    const p = this.favServerData.data[index];
    subTotal = p.product.price * p.numInFav;

    return subTotal;
  }
}
