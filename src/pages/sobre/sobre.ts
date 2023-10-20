import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';

@Component({
  selector: 'page-sobre',
  templateUrl: 'sobre.html'
})
export class SobrePageComponent {
  readonly iconArrowUp = 'ios-arrow-up-outline';
  readonly iconArrowDown = 'ios-arrow-down-outline';

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  public bemVindo;
  public objectivos;

  bemVindoIcon = this.iconArrowDown;
  objectivosIcon = this.iconArrowDown;

  // It handles the show and hide sections of the form
  accordionHandler(sectionDescription): void {
    // Ministerio da Saude
    if (sectionDescription === 'bemVindo') {
      this.bemVindo = !this.bemVindo;
      this.bemVindoIcon = this.bemVindo ? this.iconArrowUp : this.iconArrowDown;
    } else if (sectionDescription === 'objectivos') {
      this.objectivos = !this.objectivos;
      this.objectivosIcon = this.objectivos
        ? this.iconArrowUp
        : this.iconArrowDown;
    }
  }
}
