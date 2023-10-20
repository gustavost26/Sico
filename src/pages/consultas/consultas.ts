import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { ConsultaCOFetalListPageComponent } from '../consulta-co-fetal-list/consulta-co-fetal-list';
import { ConsultaCONormalListPageComponent } from '../consulta-co-normal-list/consulta-co-normal-list';
import { ConsultaBicListPageComponent } from '../consulta-bic-list/consulta-bic-list';

@Component({
  selector: 'page-consultas',
  templateUrl: 'consultas.html'
})
export class ConsultasPageComponent {
  constructor(public navCtrl: NavController, public menuCtrl: MenuController) {
    menuCtrl.enable(true, 'menuconsultas');
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  public dataEmissaoAuxAno: any;
  public dataEmissaoAuxMes: any;
  public dataEmissaoAuxDia: any;

  // It handles the menu options page
  menuHandler(buttonSelected: string): void {
    if (buttonSelected === 'consultarCONormal') {
      this.navCtrl.navigateForward('consultaCONormal');
    } else if (buttonSelected === 'consultarCOFetal') {
      this.navCtrl.navigateForward('consultaCOFetal');
    } else if (buttonSelected === 'consultarBIC') {
      this.navCtrl.navigateForward('consultaBic');
    }
  }

  // It splits the value into three
  dateParse(value: any) {
    let aux: any;
    let resultaux: any[];

    resultaux = [];
    aux = value.split('-');

    resultaux.push(aux[0]);
    resultaux.push(aux[1]);
    resultaux.push(aux[2]);

    return resultaux;
  }
}
