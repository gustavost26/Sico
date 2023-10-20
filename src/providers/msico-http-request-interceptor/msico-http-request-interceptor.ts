import { Inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
//import { App } from 'ionic-angular';

import { MsicoAlertsProvider } from '../../providers/msico-alerts/msico-alerts';
import { LoginPageComponent } from '../../pages/login/login';
import { tap } from 'rxjs';


@Injectable()
export class MSICOHttpRequestInterceptor implements HttpInterceptor {
  constructor(public msicoAlert: MsicoAlertsProvider, @Inject('app') private app: any) {} //App

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe( //Do | pipe
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want

          }
        },
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          // If there is no network
          if (err.status === 0) {
            this.msicoAlert.onErrorAlert();
          }

          if (err.status === 401) {
            this.msicoAlert.dynamicAlertsMessages(err.error.excepcaoServico);

            // Back to Login
            let nav: any = this.app.getActiveNavs();
            nav[0].setRoot(LoginPageComponent);
          } else if (err.status === 403) {
            this.msicoAlert.dynamicAlertsMessages(err.error.excepcaoServico);

            if (err.error.resultadoOutput === '-11') {
              // Back to Login
              let nav: any = this.app.getActiveNavs();
              nav[0].setRoot(LoginPageComponent);
            }
          } else if (err.status === 500) {
            if (err.error.resultadoOutput) {
              if (err.error.resultadoOutput === '-1') {
                this.msicoAlert.onErrorResultadoOutput();
              }
            } else {
              this.msicoAlert.onError500Alert();
            }
          }
        }
      }
    ));
  }
}
