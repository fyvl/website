import { Component, OnInit } from '@angular/core';
import { FavModelServer } from 'src/app/models/fav.model';
import { FavService } from 'src/app/services/fav.service';
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

  favData!: FavModelServer;
  favTotal: number = 0;

  authState!: boolean;

  constructor(public cartService: CartService,
              public favService: FavService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

    this.cartService.cartData$.subscribe(data => this.cartData = data);

    this.favService.favTotal$.subscribe(total => this.favTotal = total);

    this.favService.favData$.subscribe(data => this.favData = data);

    this.userService.authState$.subscribe(authState => this.authState = authState);
  }

}
