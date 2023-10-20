import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';
import { MsicoGeneratePdfProvider } from '../../providers/msico-generate-pdf/msico-generate-pdf';
import { MsicoAlertsProvider } from '../../providers/msico-alerts/msico-alerts';
import { MsicoWebServicesBicProvider } from '../../providers/msico-web-services-bic/msico-web-services-bic';
import { Router } from '@angular/router';

@Component({
  selector: 'page-escolha-pdf-bic',
  templateUrl: 'escolha-pdf-bic.html'
})
export class EscolhaPdfBicPageComponent implements OnInit {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private msicoWebServices: MsicoWebServicesBicProvider,
    private msicoAlerts: MsicoAlertsProvider,
    private msicoGeneratePDF: MsicoGeneratePdfProvider,
    private msicoLoading: MsicoLoadingProvider,
    public router: Router
  ) {
    if (router.getCurrentNavigation().extras.state) {
      const params: any = this.router.getCurrentNavigation().extras.state;
      console.log('params: ',  params);

      this.idBic = params.idBic;
      this.tipoDocumento = params.tipoDocumento;
      this.label = params.label;
      this.versaoCertificado = params.versaoCertificado;
    }
  }

  private idBic: string;
  private tipoDocumento: string;
  public label: string;
  private versaoCertificado: string;

  ngOnInit() {
    /*this.idBic = this.navParams.get('idBic');
    this.tipoDocumento = this.navParams.get('tipoDocumento');
    this.label = this.navParams.get('label');
    this.versaoCertificado = this.navParams.get('versaoCertificado');*/
  }

  ionViewDidLoad() {
    this.msicoLoading.onLoadingRemove();
  }

  // Create PDF from base64 string
  pdfHandler(selectType: string): void {
    this.msicoLoading.onLoading();

    if (selectType === 'pdf') {
      this.msicoWebServices
        .getBicPdf64(this.idBic, this.tipoDocumento, this.versaoCertificado)
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
        .getBicPdf64(this.idBic, this.tipoDocumento, this.versaoCertificado)
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
