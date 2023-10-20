import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular'; //ViewController, Navbar,

// Providers
import { MsicoAlertsProvider } from '../../providers/msico-alerts/msico-alerts';
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';
import { MsicoGeneratePdfProvider } from '../../providers/msico-generate-pdf/msico-generate-pdf';
import { EscolhaPdfFetalPageComponent } from '../escolha-pdf-fetal/escolha-pdf-fetal';
import { MsicoWebServicesCofetalProvider } from '../../providers/msico-web-services-cofetal/msico-web-services-cofetal';
import { MsicoUserManagerProvider } from '../../providers/msico-user-manager/msico-user-manager';

@Component({
  selector: 'page-consulta-co-fetal-details',
  templateUrl: 'consulta-co-fetal-details.html'
})
export class ConsultaCOFetalDetailsPageComponent implements OnInit {
  //@ViewChild('navbar') navBar: Navbar;
  private idCOFetal: any;

  readonly iconArrowUp = 'ios-arrow-up-outline';
  readonly iconArrowDown = 'ios-arrow-down-outline';

  // Details
  public details: any;

  public dataObitoCrianca: any;
  public nascimentoMorta: any;
  public nascimentoViva: any;
  public hospitaisValue: any;
  public numBIC: any;
  public servicoObitoOutro: any;
  public listaVersoes: any;
  public selectedVersion: any;
  public dataDetails: any;
  private dataListagemDominioTotal: string[];
  public versaoAtivaViewIndex: any;
  public versaoAtiva = true;

  // Inem - Booleans
  public errorsOnInem: any;
  public alertsOnInem: any;

  // Alerts and Erros Inem
  public listAlertasInem: any;
  public listErrorsInem: any;

  // Inem - number of the INEM
  public numCodu = '';

  // Booleans
  public identFale: any;
  public obito: any;
  public causaMorte: any;
  public dadosRelativos: any;
  public dadosRelativosMae: any;
  public medico: any;
  public ministerioPublico: any;
  public registoCivil: any;
  public controlDisableNumCodu: any;
  public showImprimirCO = false;
  public showImprimirCOSemCausasMorte = false;
  public showImprimirGuiaTransporte = false;
  public versoesAnteriores: any;
  public showAlternativeBackButtonText = false;
  public showCausasMorteConfidenciais = false;
  public resCovid19Yes = false;
  public resCovid19No = false;
  public resCovid19Suspect = false;

  // Icons
  public identIcon: string = this.iconArrowDown;
  public obitoIcon: string = this.iconArrowDown;
  public causasMorteIcon: string = this.iconArrowDown;
  public dadosRelativosIcon: string = this.iconArrowDown;
  public dadosRelativosMaeIcon: string = this.iconArrowDown;
  public medicoIcon: string = this.iconArrowDown;
  public ministerioPublicoIcon: string = this.iconArrowDown;
  public registoCivilIcon: string = this.iconArrowDown;
  public versoesAnterioresIcon: string = this.iconArrowDown;

  public localObitoInstSaude: any;
  public dataNascimentoViva: any;
  public dataNascimentoMorta: any;
  public dataObitoViva: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private msicoLoading: MsicoLoadingProvider,
    private msicoAlerts: MsicoAlertsProvider,
    private msicoWebServices: MsicoWebServicesCofetalProvider,
    private msicoGeneratePDF: MsicoGeneratePdfProvider,
    private msicoUserManagerProvider: MsicoUserManagerProvider,
    //public viewCtrl: ViewController,
    public router: Router
  ) {
    if (router.getCurrentNavigation().extras.state) {
      const params: any = this.router.getCurrentNavigation().extras.state;
      console.log('params: ',  params);

      this.details = params.detailsList;
      this.idCOFetal = this.details.idCOFetal;
      this.listaVersoes = this.details.listaVersoes;
      this.showAlternativeBackButtonText = params.showAlternativeBackButtonText;
      this.versaoAtivaViewIndex  = params.versaoAtivaViewIndex;
    }
  }

  ngOnInit() {
    //this.details = this.navParams.get('detailsList');
    //this.idCOFetal = this.details.idCOFetal;
    //this.listaVersoes = this.details.listaVersoes;
    //this.showAlternativeBackButtonText = this.navParams.get('showAlternativeBackButtonText');
    //this.versaoAtivaViewIndex = this.navParams.get('versaoAtivaViewIndex');

    // If cmConfidenciaisViaCO value is not null, then show info text 'Causas de morte confidenciais'
    if (this.details.cmConfidenciaisViaCO !== null) {
      this.showCausasMorteConfidenciais = true;
    }
    if (this.msicoUserManagerProvider.showImprimirCO()) {
      this.showImprimirCO = true;
    }
    if (this.msicoUserManagerProvider.showImprimirCOSemCausasMorte()) {
      this.showImprimirCOSemCausasMorte = true;
    }
    if (this.msicoUserManagerProvider.showImprimirGuiaTransporte()) {
      this.showImprimirGuiaTransporte = true;
    }
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

  ionViewDidLoad() {
    this.TipoEntidadeHandler(this.details.selectEntidadeObito);

    // Data Nascimento - Morta
    if (
      this.details.nascimentoDiaMorta !== null ||
      this.details.nascimentoMesMorta !== null ||
      this.details.nascimentoAnoMorta !== null ||
      this.details.nascimentoAnoViva != null ||
      this.details.nascimentoMesViva != null ||
      this.details.nascimentoDiaViva != null
    ) {
      this.dataNascimentoMorta =
        this.details.nascimentoDiaMorta +
        '-' +
        this.details.nascimentoMesMorta +
        '-' +
        this.details.nascimentoAnoMorta;

      this.dataNascimentoViva =
        this.details.nascimentoDiaViva +
        '-' +
        this.details.nascimentoMesViva +
        '-' +
        this.details.nascimentoAnoViva;
    }

    // Data Obito - Viva
    if (
      this.details.diaMorte !== null ||
      this.details.mesMorte !== null ||
      this.details.anoMorte !== null
    ) {
      this.dataObitoViva =
        this.details.diaMorte +
        '-' +
        this.details.mesMorte +
        '-' +
        this.details.anoMorte;
    }

    /*If the numCodu is null/empty then the value
    controlDisableNumCodu is true*/
    if (
      !this.details.numCodu
    ) {
      this.controlDisableNumCodu = true;
    }

    // Validate selected resCovid19 field block
    this.resCovid19FieldBlock();
  }

  // It handles the show and hide sections of the form
  accordionHandler(sectionDescription: string): void {
    // Identificacao
    if (sectionDescription === 'identFale') {
      this.identFale = !this.identFale;
      this.identIcon = this.identFale ? this.iconArrowUp : this.iconArrowDown;
    }
    // Óbito
    if (sectionDescription === 'obito') {
      this.obito = !this.obito;
      this.obitoIcon = this.obito ? this.iconArrowUp : this.iconArrowDown;
    }
    // Causas da Morte
    if (sectionDescription === 'causaMorte') {
      this.causaMorte = !this.causaMorte;
      this.causasMorteIcon = this.causaMorte
        ? this.iconArrowUp
        : this.iconArrowDown;
    }
    // Dados Relativos
    if (sectionDescription === 'dadosRelativos') {
      this.dadosRelativos = !this.dadosRelativos;
      this.dadosRelativosIcon = this.dadosRelativos
        ? this.iconArrowUp
        : this.iconArrowDown;
    }
    // Dados relativos à mãe do feto ou da criança
    if (sectionDescription === 'dadosRelativosMae') {
      this.dadosRelativosMae = !this.dadosRelativosMae;
      this.dadosRelativosMaeIcon = this.dadosRelativosMae
        ? this.iconArrowUp
        : this.iconArrowDown;
    }
    // Médico
    if (sectionDescription === 'medico') {
      this.medico = !this.medico;
      this.medicoIcon = this.medico ? this.iconArrowUp : this.iconArrowDown;
    }
    // Ministério Público
    if (sectionDescription === 'ministerioPublico') {
      this.ministerioPublico = !this.ministerioPublico;
      this.ministerioPublicoIcon = this.ministerioPublico
        ? this.iconArrowUp
        : this.iconArrowDown;
    }
    // Registo Civil
    if (sectionDescription === 'registoCivil') {
      this.registoCivil = !this.registoCivil;
      this.registoCivilIcon = this.registoCivil
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

  getCOFetalFichaInemPdf64(): void {
    this.msicoLoading.onLoading();

    this.alertsOnInem = false;
    this.errorsOnInem = false;

    this.msicoWebServices
      .getCOFetalFichaInemPdf64(this.details.numCodu)
      .subscribe(
        data => {
          let dataRetrieved: any = data;

          if (dataRetrieved.resultadoOutput === '1') {
            this.msicoLoading.onLoadingRemove();
            this.alertsOnInem = true;
            this.listAlertasInem = dataRetrieved.dadosOutput.listaAlertas;
          } else if (dataRetrieved.resultadoOutput === '2') {
            this.msicoLoading.onLoadingRemove();
            this.errorsOnInem = true;
            this.listErrorsInem = dataRetrieved.dadosOutput.listaErros;
          } else if (dataRetrieved.resultadoOutput === '0') {
            this.msicoLoading.onLoadingRemove();

            // Generate the PDF File to be read
            this.msicoGeneratePDF.CreatePDFFile(
              dataRetrieved.dadosOutput.pdfConteudo,
              dataRetrieved.dadosOutput.pdfNome
            );
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

  // It handles the type of entity to display by the result that is provided from the server
  TipoEntidadeHandler(tipoEntidade: string): void {
    if (tipoEntidade === '1') {
      this.localObitoInstSaude = this.details.idHospitaisObitoDesc;
    } else if (tipoEntidade === '2') {
      this.localObitoInstSaude = this.details.idUACObitoDesc;
    } else if (tipoEntidade === '3') {
      this.localObitoInstSaude = this.details.idOutroObitoDesc;
    }
  }

  // Create PDF from base64 string
  pdfHandler(value: string) {
    if (value === 'ImpressaoGuia') {
      // Create loading
      this.msicoLoading.onLoading();

      this.navCtrl.navigateForward('escolhaPDFFetal', {
        state: {
          idCOFetal: this.idCOFetal,
          tipoDocumento: 'guia_transporte',
          label: 'Guia de Transporte'
        }
      });

      (err: any) => {
        if (err) {
          this.msicoLoading.onLoadingRemove();
        }
      };
    } else if (value === 'ImpressaoCO') {
      this.msicoLoading.onLoading();

      this.navCtrl.navigateForward('escolhaPDFFetal', {
        state: {
          idCOFetal: this.idCOFetal,
          tipoDocumento: 'co_fetal',
          label: 'CO Fetal'
        }
      });
      (err: any) => {
        if (err) {
          this.msicoLoading.onLoadingRemove();
        }
      };
    } else if (value === 'ImpressaoCOCausas') {
      this.msicoLoading.onLoading();

      this.navCtrl.navigateForward('escolhaPDFFetal', {
        state: {
          idCOFetal: this.idCOFetal,
          tipoDocumento: 'co_fetal_bpel',
          label: 'CO s/ Causas Morte'
        }
      });

      (err: any) => {
        if (err) {
          this.msicoLoading.onLoadingRemove();
        }
      };
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
  goToSelectedVersion(idco: number) {
    this.msicoLoading.onLoading();
    this.msicoWebServices.loadDetailsCOFetalDetails(idco, 'consulta').subscribe(
      data => {
        this.msicoLoading.onLoadingRemove();

        let dataRetrieved: any = data;

        this.dataDetails = dataRetrieved.dadosOutput;

        if (this.versaoAtiva) {
          // Pass the data to the next page, including the viewIndex of the actual page which is the versaoAtiva page
          this.navCtrl.navigateForward('consultaCOFetalDetails', {
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
          this.navCtrl.navigateForward('consultaCOFetalDetails', {
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
