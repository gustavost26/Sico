import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular'; //ViewController, Navbar

// Providers
import { MsicoGeneratePdfProvider } from '../../providers/msico-generate-pdf/msico-generate-pdf';
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';
import { MsicoWebServicesConormalProvider } from '../../providers/msico-web-services-conormal/msico-web-services-conormal';

import { EscolhaPdfNormalPageComponent } from '../escolha-pdf-normal/escolha-pdf-normal';

// MomentJS
import * as moment from 'moment';
import { MsicoUserManagerProvider } from '../../providers/msico-user-manager/msico-user-manager';
import { MsicoAlertsProvider } from '../../providers/msico-alerts/msico-alerts';

@Component({
  selector: 'page-consulta-co-normal-details',
  templateUrl: 'consulta-co-normal-details.html'
})
export class ConsultaCONormalDetailsPageComponent implements OnInit {
  //@ViewChild('navbar') navBar: Navbar;
  private idCO: any;

  readonly iconArrowUp = 'ios-arrow-up';
  readonly iconArrowDown = 'ios-arrow-down';

  public details;
  public dataNascimento = '';
  public dataObito;
  public localObitoInstSaude;
  public dataNascimentoAux;
  public dataObitoAux;
  public dataEmissaoAux;
  public listaVersoes;
  public selectedVersion;
  public dataDetails;
  private dataListagemDominioTotal: string[];
  public versaoAtivaViewIndex;
  public versaoAtiva = true;

  public errorsOnInem;
  public alertsOnInem;

  // Inem
  public numCodu = '';

  // Booleans
  public identFale;
  public obito;
  public causasMorte;
  public ministerioPublico;
  public medico;
  public registoCivil;
  public versoesAnteriores;
  public controlDisableNumCodu;
  public mandatoryFieldMorteOcorreu;
  public showImprimirCO = false;
  public showImprimirCOSemCausasMorte = false;
  public showImprimirGuiaTransporte = false;
  public showAlternativeBackButtonText = false;
  public showCausasMorteConfidenciais = false;
  public resCovid19Yes = false;
  public resCovid19No = false;
  public resCovid19Suspect = false;

  // Inem Validation
  public listAlertasInem;
  public listErrorsInem;

  // Icons
  public identIcon = this.iconArrowDown;
  public obitoIcon = this.iconArrowDown;
  public causasMorteIcon = this.iconArrowDown;
  public ministerioPublicoIcon = this.iconArrowDown;
  public medicoIcon = this.iconArrowDown;
  public registoCivilIcon = this.iconArrowDown;
  public versoesAnterioresIcon = this.iconArrowDown;

  constructor(
    private navParams: NavParams,
    private msicoWebServices: MsicoWebServicesConormalProvider,
    private msicoGeneratePdf: MsicoGeneratePdfProvider,
    private msicoLoading: MsicoLoadingProvider,
    public navCtrl: NavController,
    private msicoUserManagerProvider: MsicoUserManagerProvider,
    //public viewCtrl: ViewController,
    public msicoAlerts: MsicoAlertsProvider,
    public router: Router
  ) {
    if (router.getCurrentNavigation().extras.state) {
      const params: any = this.router.getCurrentNavigation().extras.state;
      console.log('params: ',  params);

      this.details = params.detailsList;
      this.idCO = this.details.idCO;
      this.listaVersoes = this.details.listaVersoes;
      this.showAlternativeBackButtonText = params.showAlternativeBackButtonText;
      this.versaoAtivaViewIndex = params.versaoAtivaViewIndex;
    }
  }

  ngOnInit() {
    //this.details = this.navParams.get('detailsList');
    //this.idCO = this.details.idCO;
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
    /*If the dataNascimento is not null then split the value
    into and create an string with the three values to submit*/
    if (
      this.details.nascimentoDia !== null &&
      this.details.nascimentoMes !== null &&
      this.details.nascimentoAno !== null
    ) {
      this.dataNascimento =
        this.details.nascimentoDia +
        '-' +
        this.details.nascimentoMes +
        '-' +
        this.details.nascimentoAno;

      this.dataNascimentoAux =
        this.details.nascimentoAno +
        '-' +
        this.details.nascimentoMes +
        '-' +
        this.details.nascimentoDia;
    }

    /*If the dataObito is not null then split the value
    into and create an string with the three values to submit*/
    if (
      this.details.obitoDia !== null &&
      this.details.obitoMes !== null &&
      this.details.obitoAno !== null
    ) {
      this.dataObito =
        this.details.obitoDia +
        '-' +
        this.details.obitoMes +
        '-' +
        this.details.obitoAno;

      this.dataObitoAux =
        this.details.obitoAno +
        '-' +
        this.details.obitoMes +
        '-' +
        this.details.obitoDia;
    }

    let dateString = this.details.dataEmissao.split('-');

    this.dataEmissaoAux = dateString[2] + '-' + dateString[1] + '-' + dateString[0];

    /*If the numCodu is null/empty then the value
    controlDisableNumCodu is true*/
    if (
      !this.details.numCodu
    ) {
      this.controlDisableNumCodu = true;
    }

    // Tipo Entidade
    this.TipoEntidadeHandler(this.details.selectEntidadeObito);

    // Validate date for morteOcorreu field block
    this.morteOcorreuFieldBlock();

    // Validate selected resCovid19 field block
    this.resCovid19FieldBlock();
  }

  eventPrevendDefault(event: Event) {
    event.preventDefault();
  }

  getCONormalFichaInemPdf64(): void {
    this.msicoLoading.onLoading();

    this.alertsOnInem = false;
    this.errorsOnInem = false;

    this.msicoWebServices
      .getCONormalFichaInemPdf64(this.details.numCodu)
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
            this.msicoGeneratePdf.CreatePDFFile(
              dataRetrieved.dadosOutput.pdfConteudo,
              dataRetrieved.dadosOutput.pdfNome
            );
          }
        },
        err => {
          if (err) {
            this.msicoLoading.onLoadingRemove();
          }
        }
      );
  }

  // Create PDF from base64 string
  pdfHandler(value: string) {
    if (value === 'ImpressaoGuia') {
      // Create loading
      this.msicoLoading.onLoading();

      this.navCtrl.navigateForward('escolhaPDFNormal', {
        state: {
          idCO: this.idCO,
          tipoDocumento: 'guia_transporte',
          label: 'Guia de Transporte'
        }
      });

      err => {
        if (err) {
          this.msicoLoading.onLoadingRemove();
        }
      };
    } else if (value === 'ImpressaoCO') {
      this.msicoLoading.onLoading();

      this.navCtrl.navigateForward('escolhaPDFNormal', {
        state: {
          idCO: this.idCO,
          tipoDocumento: 'co_normal',
          label: 'CO Normal'
        }
      });

      err => {
        if (err) {
          this.msicoLoading.onLoadingRemove();
        }
      };
    } else if (value === 'ImpressaoCOCausas') {
      this.msicoLoading.onLoading();

      this.navCtrl.navigateForward('escolhaPDFNormal', {
        state: {
          idCO: this.idCO,
          tipoDocumento: 'co_normal_bpel',
          label: 'CO s/ Causas Morte'
        }
      });

      err => {
        if (err) {
          this.msicoLoading.onLoadingRemove();
        }
      };
    }
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

  // It handles the show and hide sections of the form
  accordionHandler(sectionDescription) {
    // Identificacao
    if (sectionDescription === 'identFale') {
      this.identFale = !this.identFale;
      this.identIcon = this.identFale ? this.iconArrowUp : this.iconArrowDown;
    }
    // Obito
    if (sectionDescription === 'obito') {
      this.obito = !this.obito;
      this.obitoIcon = this.obito ? this.iconArrowUp : this.iconArrowDown;
    }
    // Causas da Morte
    if (sectionDescription === 'causasMorte') {
      this.causasMorte = !this.causasMorte;
      this.causasMorteIcon = this.causasMorte
        ? this.iconArrowUp
        : this.iconArrowDown;
    }
    // Medico
    if (sectionDescription === 'medico') {
      this.medico = !this.medico;
      this.medicoIcon = this.medico ? this.iconArrowUp : this.iconArrowDown;
    }
    // Ministerio Publico
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

  // Validate inputs for morteOcorreu field block
  morteOcorreuFieldBlock(): void {
    let calculatedAge;
    if (this.dataNascimentoAux) {

      // Calculate birth date using MomentJS's "diff" function
      if (this.dataObitoAux) {
        calculatedAge = moment(this.dataObitoAux).diff(this.dataNascimentoAux, 'years');
      } else {
        calculatedAge = moment(this.dataEmissaoAux).diff(this.dataNascimentoAux, 'years');
      }
    }

    if (this.details.sexo === '2' && calculatedAge >= 10 && calculatedAge <= 54) {
      this.mandatoryFieldMorteOcorreu = true;
    } else {
      this.mandatoryFieldMorteOcorreu = false;
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
    if (idco != null && idco !== undefined) {
      this.msicoLoading.onLoading();
      this.msicoWebServices.loadDetailsCO(idco, 'consulta').subscribe(
        data => {
          this.msicoLoading.onLoadingRemove();

          let dataRetrieved: any = data;

          this.dataDetails = dataRetrieved.dadosOutput;

          if (this.versaoAtiva) {
            // Pass the data to the next page, including the viewIndex of the actual page which is the versaoAtiva page
            this.navCtrl.navigateForward('consultaCONormalDetails', {
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
            this.navCtrl.navigateForward('consultaCONormalDetails', {
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
