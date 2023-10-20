import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { ComplementarCoNormalPageComponent } from '../complementar-co-normal/complementar-co-normal';

import { MsicoAlertsProvider } from '../../providers/msico-alerts/msico-alerts';
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';
import { MsicoWebServicesConormalProvider } from '../../providers/msico-web-services-conormal/msico-web-services-conormal';

// Forms
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'page-consulta-complementar-co-normal',
  templateUrl: 'consulta-complementar-co-normal.html'
})
export class ConsultaComplementarCoNormalPageComponent implements OnInit {
  readonly iconArrowUp = 'ios-arrow-up-outline';
  readonly iconArrowDown = 'ios-arrow-down-outline';

  // Booleans
  public errorsOnValidation;

  public inputCO: string;
  public dataDetails;
  public dataList: any;
  private dataListagemDominioTotal: string[];
  public advancedOptions;

  // List Errors and Alerts of the validation
  listErrorsValidation;
  listAlertsValidation;

  advancedOptionsIcon = this.iconArrowDown;

  coNormalForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public msicoAlerts: MsicoAlertsProvider,
    public msicoWebServices: MsicoWebServicesConormalProvider,
    private formBuilder: FormBuilder,
    public msicoLoading: MsicoLoadingProvider
  ) {}

  ngOnInit() {
    this.coNormalForm = this.formBuilder.group({
      numCO: new FormControl({ value: '', disabled: false }),
      nic: new FormControl({ value: '', disabled: false }),
      numUtente: new FormControl({ value: '', disabled: false }),
      nomeFalecido: new FormControl({ value: '', disabled: false }),
      localObito: new FormControl({ value: '', disabled: false }),
      hospitalObito: new FormControl({ value: '', disabled: false }),
      outroLocal: new FormControl({ value: '', disabled: false }),
      dataInicioObito: new FormControl({ value: '', disabled: false }),
      dataFimObito: new FormControl({ value: '', disabled: false }),
      dataInicioCertificacao: new FormControl({ value: '', disabled: false }),
      dataFimCertificacao: new FormControl({ value: '', disabled: false })
    });
  }

  accordionHandler(sectionDescription): void {
    // Identificacao
    if (sectionDescription === 'advancedOptions') {
      this.advancedOptions = !this.advancedOptions;
      this.advancedOptionsIcon = this.advancedOptions
        ? this.iconArrowUp
        : this.iconArrowDown;
    }
  }

  // Select the CO from the input
  selectCO() {
    let listVerify: any;

    this.msicoLoading.onLoading();
    if (
      this.coNormalForm.get('numCO').value != null &&
      this.coNormalForm.get('numCO').value !== undefined &&
      this.coNormalForm.get('numCO').value !== ''
    ) {
      this.msicoWebServices
        .loadListCO(
          this.coNormalForm.get('numCO').value,
          this.coNormalForm.get('nic').value,
          this.coNormalForm.get('numUtente').value,
          this.coNormalForm.get('nomeFalecido').value,
          this.coNormalForm.get('localObito').value,
          this.coNormalForm.get('hospitalObito').value,
          this.coNormalForm.get('outroLocal').value,
          this.coNormalForm.get('dataInicioObito').value,
          this.coNormalForm.get('dataFimObito').value,
          this.coNormalForm.get('dataInicioCertificacao').value,
          this.coNormalForm.get('dataFimCertificacao').value,
          'altera'
        )
        .subscribe(
          data => {
            this.dataDetails = data;
            listVerify = data;

            if (this.dataDetails.resultadoOutput === '0') {
              this.selectedItemList(
                this.dataDetails.dadosOutput.listagem[0].idCO
              );
            } else if (this.dataDetails.resultadoOutput === '1') {
              // List of alerts to be displayed
              this.listAlertsValidation = listVerify.dadosOutput.listaAlertas;

              this.msicoLoading.onLoadingRemove();
              // this.msicoAlerts.onFailingToFoundCONormal();
            } else if (this.dataDetails.resultadoOutput === '2') {
              this.errorsOnValidation = true;

              // List of errors to be displayed
              this.listErrorsValidation = listVerify.dadosOutput.listaErros;

              this.msicoLoading.onLoadingRemove();
            } else if (this.dataDetails.resultadoOutput === '3') {
              this.msicoLoading.onLoadingRemove();
              this.msicoAlerts.onFailingToFoundCONormal();
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
      this.msicoAlerts.onFailureAlert();
      this.msicoLoading.onLoadingRemove();
    }
  }

  selectedItemList(idco: number) {
    this.msicoWebServices.loadDetailsCO(idco, 'altera').subscribe(
      data => {
        this.msicoLoading.onLoadingRemove();

        this.errorsOnValidation = false;

        let dataRetrieved: any = data;

        this.dataDetails = dataRetrieved.dadosOutput;

        // Pass the data to the next page
        this.navCtrl.navigateForward('complementarCoNormal', {
          state: {
            initialData: this.dataDetails,
            list: this.dataDetails.listagensDominio
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
  }

  // Limit Value
  limitValue(num: string, tempo: any, numChar: number) {
    if (num.length > numChar) {
      let obj = this.coNormalForm.get(tempo).value;

      obj = obj.substring(0, num.length - 1);
      this.coNormalForm.controls[tempo].setValue(obj);
    }
  }

  // Number input control
  numberInput(num: string, tempo: any, event: any) {
    // Event sent when input accepts only positive numbers
    if (event) {
      let newValue = event.value;
      let regExp = new RegExp('^[0-9?]+$');
      if (! regExp.test(newValue)) {
        let obj = this.coNormalForm.get(tempo).value;

        obj = obj.substring(0, num.length - 1);
        this.coNormalForm.controls[tempo].setValue(obj);
      }
    }
  }
}
