import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ProductModelServer, serverResponse } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { HotdealsService } from 'src/app/services/hotdeals.service';

@Component({
  selector: 'app-hotdeals',
  templateUrl: './hotdeals.component.html',
  styleUrls: ['./hotdeals.component.scss']
})
export class HotdealsComponent implements OnInit {

  products: ProductModelServer[] = [];

  constructor(private hotdealsService: HotdealsService,
              private cartService: CartService,
              private router: Router) { }

  ngOnInit(): void {
    this.hotdealsService.getAllHot().subscribe((prods: serverResponse) => {
      this.products = prods.products;
      console.log(this.products);
    });
  }

  selectProduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  AddToCart(id: number) {
    this.cartService.AddProductToCart(id);
  }

}
