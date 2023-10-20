import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';

import { LoginPageComponent } from '../../pages/login/login';
import { Market } from '@ionic-native/market/ngx';

@Injectable()
export class MsicoAlertsProvider {
  constructor(public alertCtrl: AlertController, public platform: Platform, private market: Market) {}

  private logoutPage: any;

  async dynamicAlertsMessages(dynamicMessage: any) {
    let alert = await this.alertCtrl.create({
      header: 'Atenção',
      subHeader: dynamicMessage,
      buttons: ['OK']
    });
    await alert.present();
  }

  async loginMessage() {
    let alert = await this.alertCtrl.create({
      header: 'Atenção',
      subHeader: 'Por favor introduza as suas credenciais!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async onTimeError() {
    let alert = await this.alertCtrl.create({
      header: 'Atenção',
      subHeader: 'A hora que seleccionou não pode ser 00:00',
      buttons: ['OK']
    });
    await alert.present();
  }

  async onSucessSubmitCONormal(numCO: any) {
    let alert = await this.alertCtrl.create({
      header: 'Sucesso',
      subHeader:
        'Registou o Certificado de Óbito com o número ' +
        numCO +
        ' com sucesso!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async onSucessSubmitCOFetal(numCOFetal: any) {
    let alert = await this.alertCtrl.create({
      header: 'Sucesso',
      subHeader:
        'Registou o Certificado de Óbito Fetal com o número ' +
        numCOFetal +
        ' com sucesso!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async onSucessSubmitBIC(numBIC: any) {
    let alert = await this.alertCtrl.create({
      header: 'Sucesso',
      subHeader: 'Registou o BIC com o número ' + numBIC + ' com sucesso!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async onFailingToFoundCONormal() {
    let alert = await this.alertCtrl.create({
      header: 'Insucesso',
      subHeader: 'Não foi encontrado o CO pretendido!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async onFailingToFoundCOFetal() {
    let alert = await this.alertCtrl.create({
      header: 'Insucesso',
      subHeader: 'Não foi encontrado o CO Fetal pretendido!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async onFailingToFoundBIC() {
    let alert = await this.alertCtrl.create({
      header: 'Insucesso',
      subHeader: 'Não foi encontrado o BIC pretendido!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async onLoginFailureAlert() {
    let alert = await this.alertCtrl.create({
      header: 'Insucesso',
      subHeader:
        'Falha na autenticação! Por favor verifique o seu nome de utilizador ou palavra-passe!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async onFailureAlert() {
    let alert = await this.alertCtrl.create({
      header: 'Sem resultados!',
      subHeader: 'Por favor insira o código de certificado!',
      buttons: ['OK']
    });
    await alert.present();
  }

  async onErrorAlert() {
    let alert = await this.alertCtrl.create({
      subHeader:
        'Não é possível aceder à internet - ligação inexistente ou limitada',
      buttons: ['OK']
    });
    await  alert.present();
  }

  async onError500Alert() {
    let alert = await this.alertCtrl.create({
      subHeader: 'Erro Interno de Servidor',
      buttons: ['OK']
    });
    await alert.present();
  }

  async onErrorListAlert(haveErrors: boolean) {
    if (haveErrors) {
      let alert = await this.alertCtrl.create({
        header: 'Existe erros na lista',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      let alert = await this.alertCtrl.create({
        header: 'Não existe erros na lista',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async onErrorResultadoOutput() {
    let alert = await this.alertCtrl.create({
      subHeader: 'Ocorreu um erro no acesso ao servidor, contacte o suporte...',
      buttons: ['OK']
    });
    await alert.present();
  }

  async onLoginAuthServerError() {
    let alert = await this.alertCtrl.create({
      subHeader: 'Ocorreu um erro no acesso ao servidor de Autenticação, contacte o suporte...',
      buttons: ['OK']
    });
    await alert.present();
  }

  async onLoginAppVersionOutdated() {
    let alert = await this.alertCtrl.create({
      subHeader: `
          A versão da sua aplicação está desatualizada.<br>
          Para conseguir aceder ao SICO Mobile é necessário descarregar a nova versão.
          <p>Pretende continuar?</p>
          `,
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            console.log('Go to store');
            if (this.platform.is('android')) {
              this.market.open('pt.minsaude.spms.sicomobile');
            } else if (this.platform.is('ios')) {
              this.market.open('id1355084547');
            }
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancel');
          }
        }
      ]
    });
    await alert.present();
  }

  public handlerError(error: any, navCtrl: any) {
    this.logoutPage = LoginPageComponent;

    if (error.status === 401) {
      this.dynamicAlertsMessages(JSON.parse(error._body).excepcaoServico);
      navCtrl.push(this.logoutPage);
    } else if (error.status === 403) {
      this.dynamicAlertsMessages(JSON.parse(error._body).excepcaoServico);
    }
  }
}
