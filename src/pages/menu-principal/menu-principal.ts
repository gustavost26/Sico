import { Component } from '@angular/core';
import { MenuController, Platform, NavController } from '@ionic/angular';

@Component({
  selector: 'page-menu-principal',
  templateUrl: 'menu-principal.html'
})
export class MenuPrincipalPageComponent {
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public platform: Platform
  ) {
    this.overrideHardwareBackButton();
  }

  overrideHardwareBackButton() {
    this.platform.ready().then(() => {
      //this.platform.registerBackButtonAction(() => {
        // Do Nothing
      //});
    });
  }

  private isOpen: boolean;

  openSlideMenu(): void {
    this.menuCtrl.enable(true, 'menuPrincipal');
    this.menuCtrl.open('menuPrincipal');
    this.menuCtrl.toggle();
  }

  doClick(): void {
    this.menuCtrl.enable(true, 'menuPrincipal');
    this.menuCtrl.open('menuPrincipal');
  }
}
