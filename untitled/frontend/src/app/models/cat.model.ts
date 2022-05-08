export interface CatModelServer {
  id: number;
  title: string;
  image: string;
  categories: CatModelServer[];
}


export interface cServerResponse  {
  categories: CatModelServer[];
}
