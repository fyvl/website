import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {ProductComponent} from "./components/product/product.component";
import {CartComponent} from "./components/cart/cart.component";
import {CheckoutComponent} from "./components/checkout/checkout.component";
import {ThankyouComponent} from "./components/thankyou/thankyou.component";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {ProfileGuard} from "./guard/profile.guard";
import { CatalogComponent } from './components/catalog/catalog.component';
import { CategoryComponent } from './components/category/category.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { HotdealsComponent } from './components/hotdeals/hotdeals.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'product/:id', component: ProductComponent
  },
  {
    path: 'cart', component: CartComponent
  },
  {
    path: 'checkout', component: CheckoutComponent
  },
  {
    path: 'thankyou', component: ThankyouComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'profile', component: ProfileComponent, canActivate:[ProfileGuard]
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'catalog', component: CatalogComponent
  },
  {
    path: 'category', component: CategoryComponent
  },
  {
    path: 'contacts', component: ContactsComponent
  },
  {
    path: 'hotdeals', component: HotdealsComponent
  },
  {
    path: '**', pathMatch: 'full', redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
