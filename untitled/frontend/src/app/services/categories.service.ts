import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CatModelServer } from '../models/cat.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private serverUrl = environment.SERVER_URL

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<CatModelServer> {
    return this.http.get<CatModelServer>(this.serverUrl + '/categories');
  }

}
