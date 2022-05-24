import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FavModelServer } from '../models/fav.model';

@Injectable({
  providedIn: 'root'
})
export class FavService {
  private serverUrl = environment.SERVER_URL;

constructor() { }

}
