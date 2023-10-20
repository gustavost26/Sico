import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from '@ionic/angular';

// Pages
import { MenuPrincipalPageComponent } from '../menu-principal/menu-principal';
import { EscolhaPdfFetalPageComponent } from '../escolha-pdf-fetal/escolha-pdf-fetal';

// Providers
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';
import { MsicoUserManagerProvider } from '../../providers/msico-user-manager/msico-user-manager';

@Component({
  selector: 'page-sucesso-co-fetal',
  templateUrl: 'sucesso-co-fetal.html'
})
export class SucessoCoFetalPageComponent {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private msicoLoading: MsicoLoadingProvider,
    private toastCtrl: ToastController,
    private msicoUserManagerProvider: MsicoUserManagerProvider,
    public router: Router
  ) {}

  private numCOFetalForSucess: string;
  private idCOFetal: string;
  public msgConfirmacao: any;
  private numCO: any;

  // Booleans
  public showImprimirCO = false;
  public showImprimirCOSemCausasMorte = false;
  public showImprimirGuiaTransporte = false;

  ionViewDidLoad() {
    //this.numCOFetalForSucess = this.navParams.get('numCOFetalForSucess');
    //this.idCOFetal = this.navParams.get('idCOFetal');
    //this.msgConfirmacao = this.navParams.get('msgConfirmacao');
    //this.toastHandler(this.navParams.get('operation'));

    if (this.router.getCurrentNavigation().extras.state) {
      const params: any = this.router.getCurrentNavigation().extras.state;

      this.numCOFetalForSucess = params.numCOFetalForSucess;
      this.idCOFetal = params.idCOFetal;
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

  toastHandler(typeOfOperation: any) {
    // For Complementar BIC
    if (typeOfOperation === 'complementar') {
      this.presentToastComplementar();
    } else if (typeOfOperation === 'registo') {
      this.presentToast();
    }
  }

  backToHome(): void {
    //this.navCtrl.setRoot(MenuPrincipalPageComponent);
    //this.navCtrl.setDirection;

    this.navCtrl.navigateRoot('/menu');
    this.navCtrl.setDirection;
  }

  // Create PDF from base64 string
  pdfHandler(value: string): void {
    if (value === 'ImpressaoGuia') {
      this.msicoLoading.onLoading();

      this.navCtrl.navigateForward('escolhaPDFFetal', {
        state: {
          idCOFetal: this.idCOFetal,
          tipoDocumento: 'guia_transporte',
          label: 'Guia de Transporte'
        }
      });
    } else if (value === 'ImpressaoCO') {
      this.msicoLoading.onLoading();

      this.navCtrl.navigateForward('escolhaPDFFetal', {
        state: {
          idCOFetal: this.idCOFetal,
          tipoDocumento: 'co_fetal',
          label: 'CO Fetal'
        }
      });
    } else if (value === 'ImpressaoCOCausas') {
      this.msicoLoading.onLoading();

      this.navCtrl.navigateForward('escolhaPDFFetal', { 
        state: {
          idCOFetal: this.idCOFetal,
          tipoDocumento: 'co_fetal_bpel',
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
        this.numCOFetalForSucess +
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
        this.numCOFetalForSucess +
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
