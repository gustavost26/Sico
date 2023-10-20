import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

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
import { ConsultaCOFetalDetailsPageComponent } from '../consulta-co-fetal-details/consulta-co-fetal-details';

@Component({
  selector: 'page-consulta-co-fetal-list',
  templateUrl: 'consulta-co-fetal-list.html'
})
export class ConsultaCOFetalListPageComponent implements OnInit {
  readonly iconArrowUp = 'ios-arrow-up-outline';
  readonly iconArrowDown = 'ios-arrow-down-outline';

  public inputCO: string;
  public dataDetails;
  public dataList: any;
  private dataListagemDominioTotal: string[];
  public advancedOptions;

  advancedOptionsIcon = this.iconArrowDown;

  coFetalForm: FormGroup;

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
    this.msicoLoading.onLoading();

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
          'consulta'
        )
        .subscribe(
          data => {
            this.dataDetails = data;

            if (this.dataDetails.resultadoOutput === '0') {
              this.selectedItemList(
                this.dataDetails.dadosOutput.listagem[0].idCO
              );
            } else if (this.dataDetails.resultadoOutput === '1') {
              this.msicoLoading.onLoadingRemove();
            } else if (this.dataDetails.resultadoOutput === '2') {
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
    this.msicoWebServices.loadDetailsCOFetalDetails(idco, 'consulta').subscribe(
      data => {
        this.msicoLoading.onLoadingRemove();

        let dataRetrieved: any = data;

        this.dataDetails = dataRetrieved.dadosOutput;

        // Pass the data to the next page
        /*this.navCtrl.push(ConsultaCOFetalDetailsPageComponent, {
          detailsList: this.dataDetails,
          listDomain: this.dataListagemDominioTotal
        });*/

        this.navCtrl.navigateForward('consultaCOFetalDetails', {
          state: {
            detailsList: this.dataDetails,
            listDomain: this.dataListagemDominioTotal
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
