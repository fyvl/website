import {ProductModelServer} from "./product.model";

export interface FavModelServer {
  total: number;
  data: [{
    product: ProductModelServer,
    num: number
  }];
}
