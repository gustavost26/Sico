import { LoginService } from './../../providers/login.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, Platform } from '@ionic/angular'; //Events

import { SafariViewController } from '@ionic-native/safari-view-controller/ngx/index';
import { Keyboard } from '@ionic-native/keyboard/ngx';

// Pages
import { MenuPrincipalPageComponent } from '../menu-principal/menu-principal';

// Providers
import { MsicoAuthtokenProvider } from '../../providers/msico-authtoken/msico-authtoken';
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';
import { MsicoEnviromentAccessProvider } from '../../providers/msico-enviroment-access/msico-enviroment-access';
import { MsicoUserManagerProvider } from '../../providers/msico-user-manager/msico-user-manager';
import { MsicoAuthenticationProvider } from '../../providers/msico-authentication/msico-authentication';
import { MsicoAlertsProvider } from '../../providers/msico-alerts/msico-alerts';
import { ConfigProvider } from '../../providers/config/config';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPageComponent implements OnInit {
  login: { username?: string; password?: string } = {};
  submitted = false;
  public rootPage: any;

  public didSubmit: boolean;

  private readEnviroment: any;

  public showFooter: boolean;

  constructor(
    private navCtrl: NavController,
    private msicoAuthtoken: MsicoAuthtokenProvider,
    public msicoAlerts: MsicoAlertsProvider,
    private msicoLoading: MsicoLoadingProvider,
    //public events: Events,
    private keyboard: Keyboard,
    private msicoEnviromentAccessProvider: MsicoEnviromentAccessProvider,
    private platform: Platform,
    private msicoUserManagerProvider: MsicoUserManagerProvider,
    private micoAuthenticationProvider: MsicoAuthenticationProvider,
    private configProvider: ConfigProvider,
    private ngzone: NgZone,
    private safariViewController: SafariViewController,
    private loginService: LoginService
  ) {}

  // Init
  ngOnInit() {
    this.didSubmit = true;
    this.overrideHardwareBackButton();
  }

  ionViewWillEnter() {
    this.login.username = '';
    this.login.password = '';
  }

  ionViewDidEnter() {
    this.keyboard.onKeyboardShow().subscribe(() => {
      this.showFooter = true;
    });
    this.keyboard.onKeyboardHide().subscribe(() => {
      this.showFooter = false;
    });
  }

  openUrl(url: string): void {
    this.safariViewController.isAvailable().then((available: boolean) => {
      if (available) {
        this.safariViewController
          .show({
            url: url,
            hidden: false,
            animated: false,
            transition: 'curl',
            enterReaderModeIfAvailable: true,
            tintColor: '#ff0000'
          })
          .subscribe(
            (result: any) => {
              if (result.event === 'opened') {
                return;
              } else if (result.event === 'loaded') {
                return;
              } else if (result.event === 'closed') {
                return;
              }
            },
            (error: any) => console.error(error)
          );
      } else {
        // use fallback browser, example InAppBrowser
      }
    });
  }

  onLogin(form) {
    if (!form.valid) {
      this.msicoAlerts.loginMessage();
    } else if (form.valid) {
      this.msicoLoading.onLoading();
      this.didSubmit = true;

      this.configProvider.getJSON().subscribe(
        res => {
          this.readEnviroment = res[0].enviromentMode;
          this.ngzone.run(() => {
            this.enviromentHandler();
          });
          this.auth();
        },
        error => console.log('error : ' + error)
      );
    } else {
      this.didSubmit = false;
    }
  }

  overrideHardwareBackButton() {
    this.platform.ready().then(() => {

      this.platform.backButton.subscribe(() => {
        navigator['app'].exitApp();
      });
      /*this.platform.registerBackButtonAction(() => {
        this.platform.exitApp();
      });*/
    });
  }

  private auth() {
    // Call the Authentication
    this.micoAuthenticationProvider
      .authentication(this.login.username, this.login.password)
      .subscribe(
        data => {
          this.msicoLoading.onLoadingRemove();
          let dataRetrieved: any = data;

          let user;

          user = dataRetrieved.dadosOutput.perfisUtilizador;

          if (dataRetrieved.resultadoOutput === '0') {
            /*this.events.publish(
              'user:login',
              dataRetrieved.dadosOutput.nomeClinico,
              dataRetrieved.dadosOutput.numCedulaProfissional,
              dataRetrieved.dadosOutput.perfisUtilizador
            );*/

            this.loginService.publishLogin({
              nomeClinico: dataRetrieved.dadosOutput.nomeClinico,
              numCedulaProfissional: dataRetrieved.dadosOutput.numCedulaProfissional,
              perfisUtilizador: dataRetrieved.dadosOutput.perfisUtilizador
            })

            this.msicoAuthtoken.setToken(dataRetrieved.dadosOutput.tokenJWT);
            this.navCtrl.navigateForward('menu', {state: { isOpen: true }});
          }
        },
        err => {
          if (err) {
            this.msicoLoading.onLoadingRemove();
            if (err.error.resultadoOutput === '-3') {
              this.msicoAlerts.onLoginAppVersionOutdated();
            }
            if (err.error.resultadoOutput === '-12') {
              this.msicoAlerts.onLoginAuthServerError();
            }
          }
        }
      );
  }

  private enviromentHandler() {
    switch (this.readEnviroment) {
      case 'QA': {
        this.msicoEnviromentAccessProvider.setEnviroment(
          this.msicoEnviromentAccessProvider.getQA()
        );
        break;
      }

      case 'Prod': {
        if (this.login.username === 'med1' && this.login.password === 'med1') {
          this.msicoEnviromentAccessProvider.setEnviroment(
            this.msicoEnviromentAccessProvider.getPreProd()
          );
        } else {
          this.msicoEnviromentAccessProvider.setEnviroment(
            this.msicoEnviromentAccessProvider.getProduction()
          );
        }
        break;
      }
    }
  }
}
