export interface CatModelServer {
  id: number;
  title: string;
  categories: CatModelServer[];
}


export interface cServerResponse  {
  categories: CatModelServer[];
}
