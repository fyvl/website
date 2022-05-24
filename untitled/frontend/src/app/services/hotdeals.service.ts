import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {serverResponse} from "../models/product.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HotdealsService {

  private serverUrl = environment.SERVER_URL
  constructor(private http: HttpClient) { }

  getAllHot(): Observable<serverResponse> {
    return this.http.get<serverResponse>(this.serverUrl + '/hotdeals');
  }

}

