import { Router } from '@angular/router';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';//ViewController, Navbar

// Providers
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';
import { MsicoAlertsProvider } from '../../providers/msico-alerts/msico-alerts';
import { BoletimInformacaoClinica } from '../../models/bic-model';
import { EscolhaPdfBicPageComponent } from '../escolha-pdf-bic/escolha-pdf-bic';
import { MsicoWebServicesBicProvider } from '../../providers/msico-web-services-bic/msico-web-services-bic';

@Component({
  selector: 'page-consulta-bic-details',
  templateUrl: 'consulta-bic-details.html'
})
export class ConsultaBicDetailsPageComponent implements OnInit {
  //@ViewChild('navbar') navBar: Navbar;
  public details: BoletimInformacaoClinica;
  public bicDetails;

  readonly iconArrowUp = 'ios-arrow-up';
  readonly iconArrowDown = 'ios-arrow-down';

  // Obito Verificado
  public obitoVerificado: string;
  public dataNascimento: string;

  // Falecido em
  public falecidoEm: string;

  private idBic: string;
  numBic: string;
  public numCO: string;
  public idCivil: number;
  public nUtente: number;
  public selectedVersion;
  public dataDetails: any;
  public listaVersoes;
  private dataListagemDominioTotal: string[];
  public versaoAtivaViewIndex;

  // Booleans
  public showAlternativeBackButtonText = false;
  public versaoAtiva = true;
  public showCausasMorteConfidenciais = false;
  public resCovid19Yes = false;
  public resCovid19No = false;
  public resCovid19Suspect = false;

  public identFale;
  public identCircunstancial;
  public informacaoClinica;
  public IdentifiMedico;
  public versoesAnteriores;

  public identFaleIcon = this.iconArrowDown;
  public identirCunstancialIcon = this.iconArrowDown;
  public informacaoClinicaIcon = this.iconArrowDown;
  public identifiMedicoIcon = this.iconArrowDown;
  public versoesAnterioresIcon = this.iconArrowDown;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private msicoLoading: MsicoLoadingProvider,
    private msicoAlerts: MsicoAlertsProvider,
    private msicoWebServices: MsicoWebServicesBicProvider,
    //public viewCtrl: ViewController,
    public ngZone: NgZone,
    public router: Router
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const params: any = this.router.getCurrentNavigation().extras.state;

      this.details = params.detailsList;
      this.bicDetails = params.detailsList;
      this.listaVersoes = this.bicDetails.listaVersoes;
      this.showAlternativeBackButtonText = params.showAlternativeBackButtonText;
      this.versaoAtivaViewIndex = params.versaoAtivaViewIndex
    }
  }

  ngOnInit() {
    //this.details = this.navParams.get('detailsList');
    //this.bicDetails = this.navParams.get('detailsList');
    //this.listaVersoes = this.bicDetails.listaVersoes;
    //this.showAlternativeBackButtonText = this.navParams.get('showAlternativeBackButtonText');
    //this.versaoAtivaViewIndex = this.navParams.get('versaoAtivaViewIndex');

    // If cmConfidenciaisViaCO value is not null, then show info text 'Causas de morte confidenciais'
    if (this.bicDetails.confidencial) {
      this.showCausasMorteConfidenciais = true;
    }
  }

  ionViewDidLoad() {
    this.idBic = this.details.idBic;
    this.numBic = this.details.numBic;
    this.numCO = this.details.numCO;
    this.idCivil = this.details.idCivil;
    this.nUtente = this.details.nUtente;

    /*If the obitoVerificado is not null then split the value
    into and create an string with the three values to submit*/
    if (
      this.details.diaObito !== null &&
      this.details.mesObito !== null &&
      this.details.anoObito !== null
    ) {
      this.obitoVerificado =
        this.details.diaObito +
        '-' +
        this.details.mesObito +
        '-' +
        this.details.anoObito;
    }

    /*If the falecidoEm is not null then split the value
    into and create an string with the three values to submit*/
    if (
      this.details.anoFalecido !== null &&
      this.details.mesFalecido !== null &&
      this.details.diaFalecido
    ) {
      this.falecidoEm =
        this.details.diaFalecido +
        '-' +
        this.details.mesFalecido +
        '-' +
        this.details.anoFalecido;
    }

    /*If the dataNascimento is not null then split the value
    into and create an string with the three values to submit*/
    if (
      this.details.diaNascimento !== null &&
      this.details.mesNascimento !== null &&
      this.details.anoNascimento
    ) {
      this.dataNascimento =
        this.details.diaNascimento +
        '-' +
        this.details.mesNascimento +
        '-' +
        this.details.anoNascimento;
    }

    // Validate selected resCovid19 field block
    this.resCovid19FieldBlock();
  }

  ionViewWillEnter() {
    if (this.showAlternativeBackButtonText) {
      //this.viewCtrl.setBackButtonText('Voltar p/ versão activa');
      //this.versaoAtiva = this.navParams.get('versaoAtiva');

      if (this.router.getCurrentNavigation().extras.state) {
        const params: any = this.router.getCurrentNavigation().extras.state;

        this.versaoAtiva = params.versaoAtiva;
      }
    }
  }

  //Para resolver
  ionViewDidEnter() {
    /*this.navBar.backButtonClick = () => {
      // If this version is not versaoAtiva, then popTo versaoAtiva page
      if (this.showAlternativeBackButtonText && this.versaoAtivaViewIndex) {
        //this.navCtrl.popTo(this.navCtrl.getByIndex(this.versaoAtivaViewIndex));
      } else {
        this.navCtrl.pop();
      }
    };*/
  }

  // Create PDF from base64 string
  pdfHandler(value: string) {
    if (value === 'ImpressaoBIC') {
      // Loading
      this.msicoLoading.onLoading();

      this.navCtrl.navigateForward('escolhaPDFBic', {
        state: {
          idBic: this.idBic,
          tipoDocumento: 'bic',
          label: 'BIC',
          versaoCertificado: this.details.versaoCertificado
        }
      });

      err => {
        if (err) {
          this.msicoLoading.onLoadingRemove();
          this.msicoAlerts.onErrorAlert();
        }
      };
    } else if (value === 'ImpressaoBICTransporte') {
      this.msicoLoading.onLoading();

      this.navCtrl.navigateForward('escolhaPDFBic', {
        state: {
          idBic: this.idBic,
          tipoDocumento: 'bic_sem_dados_saude',
          label: 'BIC/Transporte de cadáver',
          versaoCertificado: this.details.versaoCertificado
        }
      });

      err => {
        if (err) {
          this.msicoLoading.onLoadingRemove();
          this.msicoAlerts.onErrorAlert();
        }
      };
    }
  }

  accordionHandler(sectionDescription): void {
    // Identificacao
    if (sectionDescription === 'identFale') {
      this.identFale = !this.identFale;
      this.identFaleIcon = this.identFale
        ? this.iconArrowUp
        : this.iconArrowDown;
    }
    // Informação Circunstancial
    if (sectionDescription === 'identCircunstancial') {
      this.identCircunstancial = !this.identCircunstancial;
      this.identirCunstancialIcon = this.identCircunstancial
        ? this.iconArrowUp
        : this.iconArrowDown;
    }
    // Informação Clínica
    if (sectionDescription === 'informacaoClinica') {
      this.informacaoClinica = !this.informacaoClinica;
      this.informacaoClinicaIcon = this.informacaoClinica
        ? this.iconArrowUp
        : this.iconArrowDown;
    }
    // Identificação do Médico que Presta a Informação
    if (sectionDescription === 'IdentifiMedico') {
      this.IdentifiMedico = !this.IdentifiMedico;
      this.identifiMedicoIcon = this.IdentifiMedico
        ? this.iconArrowUp
        : this.iconArrowDown;
    }
    // Versões Anteriores
    if (sectionDescription === 'versoesAnteriores') {
      this.versoesAnteriores = !this.versoesAnteriores;
      this.versoesAnterioresIcon = this.versoesAnteriores
        ? this.iconArrowUp
        : this.iconArrowDown;
    }
  }

  // Validate selected resCovid19 field block
  resCovid19FieldBlock(): void {
    switch (this.details.resCovid19) {
      case 'V':
        this.resCovid19Yes = true;
        break;
      case 'F':
        this.resCovid19No = true;
        break;
      case 'S':
        this.resCovid19Suspect = true;
        break;
      default:
        break;
    }
  }

  // It handles which selected version of the document to open
  goToSelectedVersion(version: any) {
    let idbic = this.bicDetails.idBic;
    let versao = version;
    if (idbic != null && idbic !== undefined && versao != null && versao !== undefined) {
      this.msicoLoading.onLoading();
      this.msicoWebServices.loadDetailsBICDetails(idbic, 'consulta', versao).subscribe(
        data => {
          this.msicoLoading.onLoadingRemove();

          let dataRetrieved: any = data;

          this.dataDetails = dataRetrieved.dadosOutput;

          if (this.versaoAtiva) {
            // Pass the data to the next page, including the viewIndex of the actual page which is the versaoAtiva page
            this.navCtrl.navigateForward('consultaBicDetails', {
              state: {
                detailsList: this.dataDetails,
                listDomain: this.dataListagemDominioTotal,
                showAlternativeBackButtonText: true,
                //versaoAtivaViewIndex: this.viewCtrl.index,
                versaoAtiva: false
              }
            });
          } else {
            // Pass the data to the next page, including the viewIndex of the versaoAtiva page previously sent in navParams
            this.navCtrl.navigateForward('consultaBicDetails', {
              state: {
                detailsList: this.dataDetails,
                listDomain: this.dataListagemDominioTotal,
                showAlternativeBackButtonText: true,
                versaoAtivaViewIndex: this.versaoAtivaViewIndex,
                versaoAtiva: false
              }
            });
          }
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
