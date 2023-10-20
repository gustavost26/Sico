import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from '@ionic/angular';

// Pages
import { MenuPrincipalPageComponent } from '../menu-principal/menu-principal';
import { EscolhaPdfNormalPageComponent } from '../escolha-pdf-normal/escolha-pdf-normal';

// Providers
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';
import { MsicoUserManagerProvider } from '../../providers/msico-user-manager/msico-user-manager';

@Component({
  selector: 'page-sucesso-co-normal',
  templateUrl: 'sucesso-co-normal.html',
  styleUrls: ['sucesso-co-normal.scss'],
})
export class SucessoCoNormalPageComponent {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private msicoLoading: MsicoLoadingProvider,
    private toastCtrl: ToastController,
    private msicoUserManagerProvider: MsicoUserManagerProvider,
    public router: Router
  ) {}

  private numCO: any;
  private idCO: any;
  public msgConfirmacao: any;

  // Booleans
  public showImprimirCO = false;
  public showImprimirCOSemCausasMorte = false;
  public showImprimirGuiaTransporte = false;

  ionViewDidLoad() {
    //this.numCO = this.navParams.get('numCONormalForSucess');
    //this.idCO = this.navParams.get('idCO');

    //this.toastHandler(this.navParams.get('operation'));

    //this.msgConfirmacao = this.navParams.get('msgConfirmacao');

    if (this.router.getCurrentNavigation().extras.state) {
      const params: any = this.router.getCurrentNavigation().extras.state;
      console.log('params: ',  params);

      this.numCO = params.numCONormalForSucess;
      this.idCO = params.idCO;
      this.msgConfirmacao = params.msgConfirmacao;
      this.toastHandler(params.operation);
    }

    if (this.msicoUserManagerProvider.showImprimirCO()) {
      this.showImprimirCO = true;
    }
    if (this.msicoUserManagerProvider.showImprimirCOSemCausasMorte()) {
      this.showImprimirCOSemCausasMorte = true;
    }
    if (this.msicoUserManagerProvider.showImprimirGuiaTransporte()) {
      this.showImprimirGuiaTransporte = true;
    }
  }

  backToHome(): void {
    //this.navCtrl.setRoot(MenuPrincipalPageComponent);
    //this.navCtrl.popToRoot();

    this.navCtrl.navigateRoot('/menu');
  }

  toastHandler(typeOfOperation: any) {
    // For Complementar BIC
    if (typeOfOperation === 'complementar') {
      this.presentToastComplementar();
    } else if (typeOfOperation === 'registo') {
      this.presentToast();
    }
  }

  // Create PDF from base64 string
  pdfHandler(value: string): void {
    if (value === 'ImpressaoGuia') {
      this.msicoLoading.onLoading();

      this.navCtrl.navigateForward('escolhaPDFNormal', {
        state: {
          idCO: this.idCO,
          tipoDocumento: 'guia_transporte',
          label: 'Guia de Transporte'
        }
      });
    } else if (value === 'ImpressaoCO') {
      this.msicoLoading.onLoading();

      this.navCtrl.navigateForward('escolhaPDFNormal', {
        state: {
          idCO: this.idCO,
          tipoDocumento: 'co_normal',
          label: 'CO Normal'
        }
      });
    } else if (value === 'ImpressaoCOCausas') {
      this.msicoLoading.onLoading();

      this.navCtrl.navigateForward('escolhaPDFNormal', 
        {
          state: {
          idCO: this.idCO,
          tipoDocumento: 'co_normal_bpel',
          label: 'CO s/ Causas Morte'
        }
      });
    }
  }

  // Toast
  async presentToast() {
    let toast = await this.toastCtrl.create({
      message:
        'Sucesso! Registou o Certificado de Óbito com o número ' +
        this.numCO +
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

  // Complementar BIC Toast
  async presentToastComplementar() {
    let toast = await this.toastCtrl.create({
      message:
        'Sucesso! Atualizou o Certificado de Óbito com o número ' +
        this.numCO +
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
