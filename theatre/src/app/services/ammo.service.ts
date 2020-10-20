import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

const AMMO_URL = 'localhost:4000/ammo';

@Injectable({
  providedIn: 'root'
})
export class AmmoService {
  constructor(private http: HttpClient) {}

  fetchAmmo(): Observable<Object> {
    return this.http.get(AMMO_URL);
  }
}