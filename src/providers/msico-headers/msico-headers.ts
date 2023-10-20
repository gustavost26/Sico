import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MsicoAuthtokenProvider } from '../../providers/msico-authtoken/msico-authtoken';
import { Injectable } from '@angular/core';

@Injectable()
export class MsicoHeadersProvider {
  private targetEnviroment: any;
  private headersGet: any;

  constructor(
    public http: HttpClient,
    private msicoAuthtoken: MsicoAuthtokenProvider
  ) {}

  getHeaders() {
    this.headersGet = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'application/json; charset=utf-8')
      .set('versaoCliente', 'c_0.9.5.7.7')
      .set('tokenAuth', this.msicoAuthtoken.getToken());

    return this.headersGet;
  }
}
