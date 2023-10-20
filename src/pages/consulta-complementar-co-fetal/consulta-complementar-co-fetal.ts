import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';

// Providers
import { ComplementarCoFetalPageComponent } from '../complementar-co-fetal/complementar-co-fetal';
import { MsicoAlertsProvider } from '../../providers/msico-alerts/msico-alerts';
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';
import { MsicoWebServicesCofetalProvider } from '../../providers/msico-web-services-cofetal/msico-web-services-cofetal';

// Forms
import {
  FormControl,
  FormGroup,
  FormBuilder,
  ValidatorFn
} from '@angular/forms';

@Component({
  selector: 'page-consulta-complementar-co-fetal',
  templateUrl: 'consulta-complementar-co-fetal.html'
})
export class ConsultaComplementarCoFetalPageComponent implements OnInit {
  public coFetalForm: FormGroup;

   // Booleans
   public errorsOnValidation;

  public inputCO: string;
  public dataDetails;
  public dataList: any;
  public advancedOptions;
  private dataListagemDominioTotal: string[];

   // List Errors and Alerts of the validation
  listErrorsValidation;
  listAlertsValidation;

  constructor(
    public navCtrl: NavController,
    public msicoAlerts: MsicoAlertsProvider,
    public msicoWebServices: MsicoWebServicesCofetalProvider,
    private formBuilder: FormBuilder,
    public msicoLoading: MsicoLoadingProvider
  ) {}

  ngOnInit() {
    this.coFetalForm = this.formBuilder.group({
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

  selectCO() {
    this.msicoLoading.onLoading();

    let listVerify: any;

    if (
      this.coFetalForm.get('numCO').value != null &&
      this.coFetalForm.get('numCO').value !== undefined &&
      this.coFetalForm.get('numCO').value !== ''
    ) {
      this.msicoWebServices
        .loadListCOFetal(
          this.coFetalForm.get('numCO').value,
          this.coFetalForm.get('nic').value,
          this.coFetalForm.get('numUtente').value,
          this.coFetalForm.get('nomeFalecido').value,
          this.coFetalForm.get('localObito').value,
          this.coFetalForm.get('hospitalObito').value,
          this.coFetalForm.get('outroLocal').value,
          this.coFetalForm.get('dataInicioObito').value,
          this.coFetalForm.get('dataFimObito').value,
          this.coFetalForm.get('dataInicioCertificacao').value,
          this.coFetalForm.get('dataFimCertificacao').value,
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
              this.msicoLoading.onLoadingRemove();

              // List of alerts to be displayed
              this.listAlertsValidation = listVerify.dadosOutput.listaAlertas;

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
    this.msicoWebServices.loadDetailsCOFetalDetails(idco, 'altera').subscribe(
      data => {
        this.msicoLoading.onLoadingRemove();

        let dataRetrieved: any = data;

        this.dataDetails = dataRetrieved.dadosOutput;

        this.errorsOnValidation = false;

        // Pass the data to the next page
        /*this.navCtrl.push(ComplementarCoFetalPageComponent, {
          detailsList: this.dataDetails,
          listDomain: dataRetrieved.dadosOutput.listagensDominio
        });*/

        this.navCtrl.navigateForward('complementarCoFetal', {
          state: {
            detailsList: this.dataDetails,
            listDomain: dataRetrieved.dadosOutput.listagensDominio
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
      let obj = this.coFetalForm.get(tempo).value;

      obj = obj.substring(0, num.length - 1);
      this.coFetalForm.controls[tempo].setValue(obj);
    }
  }

  // Number input control
  numberInput(num: string, tempo: any, event: any) {
    // Event sent when input accepts only positive numbers
    if (event) {
      let newValue = event.value;
      let regExp = new RegExp('^[0-9?]+$');
      if (! regExp.test(newValue)) {
        let obj = this.coFetalForm.get(tempo).value;

        obj = obj.substring(0, num.length - 1);
        this.coFetalForm.controls[tempo].setValue(obj);
      }
    }
  }
}
