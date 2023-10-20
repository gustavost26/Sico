import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';

import { ConsultaBicDetailsPageComponent } from '../consulta-bic-details/consulta-bic-details';

import { MsicoWebServicesBicProvider } from '../../providers/msico-web-services-bic/msico-web-services-bic';
import { MsicoAlertsProvider } from '../../providers/msico-alerts/msico-alerts';
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';

// Forms
import {
  FormControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';

@Component({
  selector: 'page-consulta-bic-list',
  templateUrl: 'consulta-bic-list.html'
})
export class ConsultaBicListPageComponent implements OnInit {
  readonly iconArrowUp = 'ios-arrow-up-outline';
  readonly iconArrowDown = 'ios-arrow-down-outline';

  // Booleans
  public errorsOnValidation;
  public alertsOnValidation;

  public advancedOptions;
  public advancedOptionsIcon;

  public inputBIC: String;
  public bicForm: FormGroup;

  // List Errors and Alerts of the validation
  listErrorsValidation;
  listAlertsValidation;

  public datalistBic;
  private detailsBIC: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public msicoAlerts: MsicoAlertsProvider,
    public msicoWebServices: MsicoWebServicesBicProvider,
    public msicoLoading: MsicoLoadingProvider,
    private formBuilder: FormBuilder
  ) {}

  // Init
  ngOnInit() {
    this.advancedOptionsIcon = this.iconArrowDown;

    this.bicForm = this.formBuilder.group({
      numBIC: new FormControl({ value: '', disabled: false }),
      nic: new FormControl({ value: '', disabled: false }),
      numUtente: new FormControl({ value: '', disabled: false }),
      nomeFalecido: new FormControl({ value: '', disabled: false })
    });
  }

  accordionHandler(sectionDescription): void {
    if (sectionDescription === 'advancedOptions') {
      this.advancedOptions = !this.advancedOptions;
      this.advancedOptionsIcon = this.advancedOptions
        ? this.iconArrowUp
        : this.iconArrowDown;
    }
  }

  BICList() {
    this.msicoLoading.onLoading();

    let listVerify: any;

    if (
      this.bicForm.get('numBIC').value !== null ||
      this.bicForm.get('numBIC').value !== undefined
    ) {
      this.msicoWebServices
        .loadListBIC(
          this.bicForm.get('numBIC').value,
          this.bicForm.get('nic').value,
          this.bicForm.get('numUtente').value,
          this.bicForm.get('nomeFalecido').value,
          'consulta'
        )
        .subscribe(
          data => {
            let dataRetrieved: any = data;

            listVerify = data;

            if (dataRetrieved.resultadoOutput === '0') {
              this.OnSelectBIC(dataRetrieved.dadosOutput['listagem'][0].idBIC);
            } else if (dataRetrieved.resultadoOutput === '1') {
              this.alertsOnValidation = true;

              // List of alerts to be displayed
              this.listAlertsValidation = listVerify.dadosOutput.listaAlertas;
              this.msicoLoading.onLoadingRemove();
            } else if (dataRetrieved.resultadoOutput === '2') {
              this.errorsOnValidation = true;

              // List of errors to be displayed
              this.listErrorsValidation = listVerify.dadosOutput.listaErros;
              this.msicoLoading.onLoadingRemove();
            } else if (dataRetrieved.resultadoOutput === '3') {
              this.msicoLoading.onLoadingRemove();
              this.msicoAlerts.onFailingToFoundBIC();
            }
          },
          err => {
            if (err) {
              this.msicoLoading.onLoadingRemove();
              this.msicoAlerts.handlerError(err, this.navCtrl);
            }
          }
        );
    } else {
      this.msicoLoading.onLoadingRemove();
      this.msicoAlerts.onFailureAlert();
      this.datalistBic = null;
    }
  }

  // On select the item from the list
  OnSelectBIC(bic) {
    if (bic !== null || bic !== undefined) {
      this.msicoWebServices.loadDetailsBICDetails(bic, 'consulta').subscribe(
        data => {
          let dataRetrieved: any = data;

          this.errorsOnValidation = false;
          this.alertsOnValidation = false;

          this.msicoLoading.onLoadingRemove();
          this.detailsBIC = dataRetrieved.dadosOutput;

          // Pass the data to the next page
          this.navCtrl.navigateForward('consultaBicDetails', {
            state: {
              detailsList: this.detailsBIC
            }
          });
        },
        err => {
          if (err) {
            this.msicoAlerts.handlerError(err, this.navCtrl);
            this.msicoLoading.onLoadingRemove();
          }
        }
      );
    }
  }

  // Limit Value
  limitValue(num: string, tempo: any, numChar: number) {
    if (num.length > numChar) {
      let obj = this.bicForm.get(tempo).value;

      obj = obj.substring(0, num.length - 1);
      this.bicForm.controls[tempo].setValue(obj);
    }
  }

  // Number input control
  numberInput(num: string, tempo: any, event: any) {
    // Event sent when input accepts only positive numbers
    if (event) {
      let newValue = event.value;
      let regExp = new RegExp('^[0-9?]+$');
      if (! regExp.test(newValue)) {
        let obj = this.bicForm.get(tempo).value;

        obj = obj.substring(0, num.length - 1);
        this.bicForm.controls[tempo].setValue(obj);
      }
    }
  }
}
