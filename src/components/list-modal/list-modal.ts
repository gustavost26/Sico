import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, NavParams, AlertController } from '@ionic/angular'; //ViewController

@Component({
  selector: 'list-modal',
  templateUrl: 'list-modal.html'
})
export class ListModalComponent {
  public datalist: string[];
  public Description;

  searchQuery: string = '';
  items: any;

  public customModalTpMorteMulherAux = false;
  public customModalLocalObitoAux = false;

  constructor(
    public navCtrl: NavController,
    //public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public router: Router
  ) {

    if (router.getCurrentNavigation().extras.state) {
      const params: any = this.router.getCurrentNavigation().extras.state;

      this.datalist = params.l;
      this.Description = params.desc;
    }

    //this.datalist = this.navParams.get('l');
    //this.Description = this.navParams.get('desc');

    this.items = this.datalist;

    if (this.Description === 'Tipo morte mulher') {
      this.customModalTpMorteMulherAux = true;
    }
  }

  initializeItems() {
    this.items = this.datalist;
  }

  selectedItemList(labelData, DataData): void {
    // Condition for showing custom modal regarding 'morteOcorreu' field
    if (this.customModalTpMorteMulherAux && DataData !== null) {
      this.customModalTpMorteMulher(labelData, DataData);
    } else {
      //this.viewCtrl.dismiss({ labelData, DataData });
    }
  }

  /**
   * Shows a pop up with a custom message.
   * If user clicks "Não", the field is set to default. Else, the field's choice is maintained.
   */
  async customModalTpMorteMulher(labelData: any, DataData: any) {
    let defaultOption = {
      labelData: '<Escolher>',
      DataData: null
    }
    let alert = await this.alertCtrl.create({
      header: 'Alerta',
      subHeader: 'Acabou de indicar uma eventual MORTE MATERNA. Tem a certeza que pretende gravar esta opção?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: () => {
            //this.viewCtrl.dismiss(defaultOption);
          }
        },
        {
          text: 'Sim',
          handler: () => {
            //this.viewCtrl.dismiss({ labelData, DataData });
          }
        }
      ],
      backdropDismiss: false
    });

    await alert.present();
  }

  dismiss(): void {
    //this.viewCtrl.dismiss();
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '') {
      this.items = this.items.filter(item => {
        return item.label.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }
}
