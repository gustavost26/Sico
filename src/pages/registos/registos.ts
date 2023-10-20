import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

import { MsicoAlertsProvider } from '../../providers/msico-alerts/msico-alerts';
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';

import { RegistoCONormalPageComponent } from '../registo-co-normal/registo-co-normal';
import { RegistoCoFetalPageComponent } from '../registo-co-fetal/registo-co-fetal';
import { RegistoBicPageComponent } from '../registo-bic/registo-bic';

import { ConsultasPageComponent } from '../consultas/consultas';
import { EscolhaPdfNormalPageComponent } from '../escolha-pdf-normal/escolha-pdf-normal';
import { MsicoWebServicesConormalProvider } from '../../providers/msico-web-services-conormal/msico-web-services-conormal';
import { MsicoWebServicesCofetalProvider } from '../../providers/msico-web-services-cofetal/msico-web-services-cofetal';
import { MsicoWebServicesBicProvider } from '../../providers/msico-web-services-bic/msico-web-services-bic';

@Component({
  selector: 'page-registos',
  templateUrl: 'registos.html'
})
export class RegistosPageComponent {
  constructor(
    public navCtrl: NavController,
    //public nav: Nav,
    public msicoWebServicesConormalProvider: MsicoWebServicesConormalProvider,
    public msicoWebServicesCofetalProvider: MsicoWebServicesCofetalProvider,
    public msicoWebServicesBicProvider: MsicoWebServicesBicProvider,
    public msicoLoading: MsicoLoadingProvider,
    public msicoAlerts: MsicoAlertsProvider,
    public menuCtrl: MenuController
  ) {
    //let view = this.nav.getActive();
  }

  public dataEmissaoAuxAno;
  public dataEmissaoAuxMes;
  public dataEmissaoAuxDia;

  doClick(): void {
    this.menuCtrl.enable(true, 'menuregistos');
    this.menuCtrl.open('menuregistos');
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  // It handles the menu options page
  menuHandler(buttonSelected): void {
    let dadosIniciaisCONormal;
    let dadosIniciaisCOFetal;
    let dadosIniciaisBIC;

    if (buttonSelected === 'registoCONormal') {
      this.msicoLoading.onLoading();

      // Call the webservice to retrieve the data
      this.msicoWebServicesConormalProvider
        .getInitialDataCONormalServices()
        .subscribe(
          data => {
            let dataRetrieved: any = data;

            if (dataRetrieved.dadosOutput) {
              dadosIniciaisCONormal = dataRetrieved.dadosOutput;

              // Emission Date (Year, Month, Day)
              this.dataEmissaoAuxAno = this.dateParse(
                dadosIniciaisCONormal.dataEmissao
              )[2];
              this.dataEmissaoAuxMes = this.dateParse(
                dadosIniciaisCONormal.dataEmissao
              )[1];
              this.dataEmissaoAuxDia = this.dateParse(
                dadosIniciaisCONormal.dataEmissao
              )[0];

              this.msicoWebServicesConormalProvider
                .getTotalDomainListCONormalServices(
                  'CO_CRIAR',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  this.dataEmissaoAuxAno,
                  this.dataEmissaoAuxMes,
                  this.dataEmissaoAuxDia
                )
                .subscribe(data => {
                  this.msicoLoading.onLoadingRemove();
                  this.navCtrl.navigateForward('registoCONormal', {
                    state: {
                      initialData: dadosIniciaisCONormal,
                    initialList: data
                    }
                  });
                });
            }
          },
          err => {
            if (err) {
              this.msicoLoading.onLoadingRemove();
              if (err.status === 0) {
                this.msicoAlerts.onErrorAlert();
              }
            }
          }
        );
    } else if (buttonSelected === 'registoCOFetal') {
      this.msicoLoading.onLoading();

      this.msicoWebServicesCofetalProvider
        .getInitialDataCOFetalServices()
        .subscribe(
          data => {
            let dataRetrieved: any = data;

            dadosIniciaisCOFetal = dataRetrieved.dadosOutput;

            // Emission Date (Year, Month, Day)
            this.dataEmissaoAuxAno = this.dateParse(
              dadosIniciaisCOFetal.dataEmissao
            )[2];
            this.dataEmissaoAuxMes = this.dateParse(
              dadosIniciaisCOFetal.dataEmissao
            )[1];
            this.dataEmissaoAuxDia = this.dateParse(
              dadosIniciaisCOFetal.dataEmissao
            )[0];

            this.msicoWebServicesCofetalProvider
              .getTotalDomainListCOFetalServices(
                'CO_CRIAR',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                this.dataEmissaoAuxAno,
                this.dataEmissaoAuxMes,
                this.dataEmissaoAuxDia
              )
              .subscribe(
                data => {
                  this.msicoLoading.onLoadingRemove();
                  this.navCtrl.navigateForward('registoCoFetal', {
                    state: {
                      initialData: dadosIniciaisCOFetal,
                      initialList: data
                    }
                  });
                },
                err => {
                  if (err) {
                    this.msicoLoading.onLoadingRemove();
                    this.msicoAlerts.handlerError(err, this.navCtrl);
                  }
                }
              );
          },
          err => {
            if (err) {
              this.msicoLoading.onLoadingRemove();
              if (err.status === 0) {
                this.msicoAlerts.onErrorAlert();
              }
            }
          }
        );
    } else if (buttonSelected === 'registoBIC') {
      this.msicoLoading.onLoading();

      this.msicoWebServicesBicProvider.getInitialDataBICServices().subscribe(
        data => {
          let dataRetrieved: any = data;

          dadosIniciaisBIC = dataRetrieved.dadosOutput;

          // Emission Data(Year, Month, Day)
          this.dataEmissaoAuxAno = this.dateParse(
            dadosIniciaisBIC.dataEmissao
          )[2];
          this.dataEmissaoAuxMes = this.dateParse(
            dadosIniciaisBIC.dataEmissao
          )[1];
          this.dataEmissaoAuxDia = this.dateParse(
            dadosIniciaisBIC.dataEmissao
          )[0];

          this.msicoWebServicesBicProvider
            .getTotalDomainListBICServices(
              'BIC_CRIAR',
              '',
              '',
              '',
              '',
              '',
              '',
              '',
              ''
            )
            .subscribe(
              data => {
                this.msicoLoading.onLoadingRemove();
                this.navCtrl.navigateForward('registoBic', {
                  state: {
                    initialData: dadosIniciaisBIC,
                    initialList: data
                  }
                });
              },
              err => {
                if (err) {
                  this.msicoLoading.onLoadingRemove();
                  this.msicoAlerts.handlerError(err, this.navCtrl);
                }
              }
            );
        },
        err => {
          if (err) {
            this.msicoLoading.onLoadingRemove();
            if (err.status === 0) {
              this.msicoAlerts.onErrorAlert();
            }
          }
        }
      );
    } else if (buttonSelected === 'registos') {
      this.navCtrl.navigateForward('registos');
      //this.navCtrl.push(RegistosPageComponent);
      this.menuCtrl.enable(true, 'menuregistos');
      this.menuCtrl.enable(false, 'menuconsultas');
    } else if (buttonSelected === 'consultas') {
      this.navCtrl.navigateForward('consultas');
      //this.navCtrl.push(ConsultasPageComponent);
      this.menuCtrl.enable(false, 'menuregistos');
      this.menuCtrl.enable(true, 'menuconsultas');
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
