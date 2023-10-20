import { HttpClient } from '@angular/common/http';
import { MsicoHeadersProvider } from '../../providers/msico-headers/msico-headers';
import { MsicoEnviromentAccessProvider } from '../../providers/msico-enviroment-access/msico-enviroment-access';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs';

const timeToTimeOut: number = 60000;

@Injectable()
export class MsicoAuthenticationProvider {

  constructor(
    public http: HttpClient,
    private msicoEnviromentAccessProvider: MsicoEnviromentAccessProvider,
    private msicoHeadersProvider: MsicoHeadersProvider
  ) {}

  /*********************************************************************
   ***                    AUTENTHICATION function
   **********************************************************************/
  public authentication(user: any, pass: any) {
    let body: string = 'utilizador=' + user + '&' + 'password=' + pass;

    return this.http
      .post(
        this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
          '/autenticacao/autenticaUser',
        body,
        {
          headers: this.msicoHeadersProvider.getHeaders()
        }
      )
      .pipe(delay(timeToTimeOut));
  }
}
