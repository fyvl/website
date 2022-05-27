import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FavModelServer } from 'src/app/models/fav.model';
import { ProductModelServer, serverResponse } from 'src/app/models/product.model';
import { FavService } from 'src/app/services/fav.service';
import { ProductService } from 'src/app/services/product.service';
import {CartModelServer} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartData!: CartModelServer;
  cartTotal: number = 0;

  inpt: string;
  products: ProductModelServer[] = [];
  arr: ProductModelServer[] = [];

  favData!: FavModelServer;
  favTotal: number = 0;

  authState!: boolean;

  constructor(public cartService: CartService,
              private productService: ProductService,
              public favService: FavService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

    this.cartService.cartData$.subscribe(data => this.cartData = data);

    this.favService.favTotal$.subscribe(total => this.favTotal = total);

    this.favService.favData$.subscribe(data => this.favData = data);

    this.userService.authState$.subscribe(authState => this.authState = authState);

    this.productService.getAll().subscribe((prods: serverResponse) => {
      this.products = prods.products;
      console.log(this.products);
    });
  }

  pSelect = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])

  searchProducts(control: FormControl) {
    if(control && control.value.length > 2) {
      this.products.filter(e => {
        console.log(e);
        return e.name == control.value
      })
    }
  }

}
