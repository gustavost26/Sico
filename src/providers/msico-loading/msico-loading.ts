import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MsicoLoadingProvider {
  public loadingPopup: any;

  constructor(public loadingCtrl: LoadingController) {}

  // Create an Loading
  public onLoading(): void {
    // Create the popup
    this.loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      message: 'Aguarde um momento por favor...',
      duration: 60000
    });

    this.loadingPopup.present();

  }

  // Remove the current Loading avaliable
  public onLoadingRemove(): void {
    this.loadingPopup.dismiss().catch(() => {
      '';
    });
  }
}
