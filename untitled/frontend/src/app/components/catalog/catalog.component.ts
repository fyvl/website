import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatModelServer, cServerResponse } from 'src/app/models/cat.model';
import { ProductModelServer } from 'src/app/models/product.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  categories: CatModelServer[] = [];
  products: ProductModelServer[] = [];

  constructor(private categoryService: CategoriesService,
              private productService: ProductService,
              private router: Router) { }

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe((cats: cServerResponse) => {
      this.categories = cats.categories;
      console.log(this.categories);
    });
  }

  selectCategory(title: string) {
    this.router.navigate(['/category', {title}]);
  }

}
