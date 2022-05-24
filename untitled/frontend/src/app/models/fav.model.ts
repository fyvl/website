import {ProductModelServer} from "./product.model";

export interface FavModelServer {
  total: number;
  data: [{
    product: ProductModelServer,
    numInFav: number
  }];
}


export interface FavModelPublic  {
  total: number;
  prodData: [{
    id: number,
    inFav: number
    }];
}
