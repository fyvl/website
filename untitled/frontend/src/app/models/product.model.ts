export interface ProductModelServer {
  id: number;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  images: string;
  is_hot: number;
}


export interface serverResponse  {
  count: number;
  products: ProductModelServer[];
}
