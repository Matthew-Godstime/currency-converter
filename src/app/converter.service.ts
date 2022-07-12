import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ConverterService {

  private _url = environment._url;
  private _key = environment._key;
  constructor(private http: HttpClient) { }

  public getCurrentExchange() {
    const params = new HttpParams()
      .set('method', 'GET')
      .set('redirect', 'follow')
      .set('headers', this._key)
      .set("apikey", this._key);

    return this.http.get(this._url, { params });
  }
}
