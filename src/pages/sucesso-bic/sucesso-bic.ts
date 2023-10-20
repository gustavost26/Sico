import { Component } from '@angular/core';
import { ToastController, NavController, NavParams } from '@ionic/angular';

// Pages
import { MenuPrincipalPageComponent } from '../menu-principal/menu-principal';
import { EscolhaPdfBicPageComponent } from '../escolha-pdf-bic/escolha-pdf-bic';

// Providers
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';

import { IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'page-sucesso-bic',
  templateUrl: 'sucesso-bic.html'
})
export class SucessoBicPageComponent {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private msicoLoading: MsicoLoadingProvider,
    private toastCtrl: ToastController,
    private ionRouterOutlet: IonRouterOutlet,
    public router: Router
  ) {}

  private numBic: any;
  private idBic: any;
  public msgConfirmacao: any;

  ionViewDidLoad() {
    //this.numBic = this.navParams.get('numBic');
    //this.idBic = this.navParams.get('idBic');
    //this.msgConfirmacao = this.navParams.get('msgConfirmacao');
    //this.toastHandler(this.navParams.get('operation'));

    if (this.router.getCurrentNavigation().extras.state) {
      const params: any = this.router.getCurrentNavigation().extras.state;
      console.log('params: ',  params);

      this.numBic = params.numBic;
      this.idBic = params.idBic;
      this.msgConfirmacao = params.msgConfirmacao;
      this.toastHandler(params.operation);
    }
  }

  backToHome(): void {
    //this.navCtrl.setRoot(MenuPrincipalPageComponent);
    //this.navCtrl.popToRoot();
    
    //this.ionRouterOutlet.pop();

    this.navCtrl.navigateRoot('/menu');

  }

  toastHandler(typeOfOperation: any) {
    if (typeOfOperation === 'complementar') {
      this.presentToastComplementar();
    } else if (typeOfOperation === 'registo') {
      this.presentToastRegisto();
    }
  }

  // Create PDF from base64 string
  pdfHandler(value: string): void {
    if (value === 'ImpressaoBIC') {
      this.msicoLoading.onLoading();

      this.navCtrl.navigateForward('escolhaPDFBic', {
        state: {
          idBic: this.idBic,
          tipoDocumento: 'bic',
          label: 'BIC'
        }
      });
    } else if (value === 'ImpressaoBICTransporte') {
      this.msicoLoading.onLoading();
      this.navCtrl.navigateForward('escolhaPDFBic', {
        state: {
          idBic: this.idBic,
          tipoDocumento: 'bic_sem_dados_saude',
          label: 'BIC/Transporte de cadáver'
        }
      });
    }
  }

  // Registo Toast
  async presentToastRegisto() {
    let toast = await this.toastCtrl.create({
      message:
        'Sucesso! Registou o Boletim de Informação Clínica ' +
        this.numBic +
        ' com sucesso!',
      cssClass: 'toastStyle',
      buttons: [{
        icon: 'close',
        text: 'Fechar',
        role: 'cancel',
      }],
      position: 'top'
    });

    await toast.present();
  }

  // Complementar Toast
  async presentToastComplementar() {
    let toast = await this.toastCtrl.create({
      message:
        'Sucesso! Atualizou o Boletim de Informação Clínica ' +
        this.numBic +
        ' com sucesso!',
      cssClass: 'toastStyle',
      buttons: [{
        icon: 'close',
        text: 'Fechar',
        role: 'cancel',
      }],
      position: 'top'
    });

    await toast.present();
  }
}
