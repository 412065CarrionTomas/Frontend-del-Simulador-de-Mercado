import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FinishMarket {
  private readonly url = 'http://localhost:8080/inserAllOrdersInOrderBook';

  constructor(private http: HttpClient) { }

  sendRequestFinishMarket(): Observable<any> {
    return this.http.get('${this.url}');
  }
}
