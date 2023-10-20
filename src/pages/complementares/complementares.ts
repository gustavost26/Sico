import { Component } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular'; //Nav

import { MsicoAlertsProvider } from '../../providers/msico-alerts/msico-alerts';
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';

import { ConsultaComplementarCoNormalPageComponent } from '../consulta-complementar-co-normal/consulta-complementar-co-normal';
import { ConsultaComplementarCoFetalPageComponent } from '../consulta-complementar-co-fetal/consulta-complementar-co-fetal';
import { ConsultaComplementarBicPageComponent } from '../consulta-complementar-bic/consulta-complementar-bic';

@Component({
  selector: 'page-complementares',
  templateUrl: 'complementares.html'
})
export class ComplementaresPageComponent {
  constructor(
    public navCtrl: NavController,
    //public nav: Nav,
    public msicoLoading: MsicoLoadingProvider,
    public msicoAlerts: MsicoAlertsProvider,
    public menuCtrl: MenuController
  ) {
    //let view = this.nav.getActive();
  }

  public dataEmissaoAuxAno;
  public dataEmissaoAuxMes;
  public dataEmissaoAuxDia;

  // It handles the menu options page
  menuHandler(buttonSelected): void {

    if (buttonSelected === 'ComplementarCONormal') {
      this.navCtrl.navigateForward('consultaComplementarCONormal');
    } else if (buttonSelected === 'ComplementarCOFetal') {
      this.navCtrl.navigateForward('consultaComplementarCOFetal');
    } else if (buttonSelected === 'ComplementarBIC') {
      this.navCtrl.navigateForward('consultaComplementarBic');
    }
  }

  // It splits the value into three
  dateParse(value) {
    let aux;
    let resultaux: any[];

    resultaux = [];
    aux = value.split('-');

    resultaux.push(aux[0]);
    resultaux.push(aux[1]);
    resultaux.push(aux[2]);

    return resultaux;
  }
}
