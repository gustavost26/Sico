import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';
import { MsicoGeneratePdfProvider } from '../../providers/msico-generate-pdf/msico-generate-pdf';
import { MsicoAlertsProvider } from '../../providers/msico-alerts/msico-alerts';
import { MsicoWebServicesCofetalProvider } from '../../providers/msico-web-services-cofetal/msico-web-services-cofetal';
import { Router } from '@angular/router';

@Component({
  selector: 'page-escolha-pdf-fetal',
  templateUrl: 'escolha-pdf-fetal.html'
})
export class EscolhaPdfFetalPageComponent implements OnInit {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private msicoWebServices: MsicoWebServicesCofetalProvider,
    private msicoAlerts: MsicoAlertsProvider,
    private msicoGeneratePDF: MsicoGeneratePdfProvider,
    private msicoLoading: MsicoLoadingProvider,
    public router: Router
  ) {
    if (router.getCurrentNavigation().extras.state) {
      const params: any = this.router.getCurrentNavigation().extras.state;

      this.idCOFetal = params.idCOFetal;
      this.tipoDocumento = params.tipoDocumento;
      this.label = params.label;
    }
  }

  private idCOFetal: string;
  private tipoDocumento: string;
  public label: string;

  ngOnInit() {
    /*this.idCOFetal = this.navParams.get('idCOFetal');
    this.tipoDocumento = this.navParams.get('tipoDocumento');
    this.label = this.navParams.get('label');*/
  }

  ionViewDidLoad() {
    this.msicoLoading.onLoadingRemove();
  }

  // Create PDF from base64 string
  pdfHandler(selectType: string): void {
    this.msicoLoading.onLoading();

    if (selectType === 'pdf') {
      this.msicoWebServices
        .getCOFetalPdf64(this.idCOFetal, this.tipoDocumento)
        .subscribe(
          data => {
            this.msicoLoading.onLoadingRemove();

            let dataRetrieved: any = data;

            // Generate the PDF File to be read
            this.msicoGeneratePDF.CreatePDFFile(
              dataRetrieved.dadosOutput.pdfConteudo,
              dataRetrieved.dadosOutput.pdfNome
            );
          },
          err => {
            if (err) {
              this.msicoLoading.onLoadingRemove();
              this.msicoAlerts.handlerError(err, this.navCtrl);
            }
          }
        );
    } else if (selectType === 'pdfToMail') {
      this.msicoWebServices
        .getCOFetalPdf64(this.idCOFetal, this.tipoDocumento)
        .subscribe(
          data => {
            this.msicoLoading.onLoadingRemove();

            let dataRetrieved: any = data;

            // Generate the PDF File to be read
            this.msicoGeneratePDF.CreatePDFFileToSend(
              dataRetrieved.dadosOutput.pdfConteudo,
              dataRetrieved.dadosOutput.pdfNome
            );
          },
          err => {
            if (err) {
              this.msicoLoading.onLoadingRemove();
              this.msicoAlerts.handlerError(err, this.navCtrl);
            }
          }
        );
    }
  }
}
