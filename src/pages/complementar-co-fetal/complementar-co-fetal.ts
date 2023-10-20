import { Router } from '@angular/router';
import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import {
  NavController,
  NavParams,
  ModalController,
  MenuController,
  AlertController,
} from '@ionic/angular'; //Content,

// Forms
import {
  FormControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';

// Models
import { CertificadoObitoFetal } from '../../models/co-fetal-model';

// Sucess Fetal
import { SucessoCoFetalPageComponent } from '../sucesso-co-fetal/sucesso-co-fetal';

// Components
import { ListModalComponent } from '../../components/list-modal/list-modal';

// Providers
import { MsicoAlertsProvider } from '../../providers/msico-alerts/msico-alerts';
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';
import { MsicoGeneratePdfProvider } from '../../providers/msico-generate-pdf/msico-generate-pdf';
import { MsicoWebServicesCofetalProvider } from '../../providers/msico-web-services-cofetal/msico-web-services-cofetal';

const iconArrowUp = 'ios-arrow-up';
const iconArrowDown = 'ios-arrow-down';

@Component({
  selector: 'page-complementar-co-fetal',
  templateUrl: 'complementar-co-fetal.html'
})
export class ComplementarCoFetalPageComponent implements OnInit {
  //@ViewChild(Content) content: Content;

  coFetalForm: FormGroup;

  // Lists
  public list;

  private idCOFetal;

  private initialData;

  // Booleans Sections
  public identFale;
  public obito;
  public causaMorte;
  public dadosRelativos;
  public dadosRelativosMae;
  public medico;
  public ministerioPublico;
  public versoesAnteriores;

  // Booleans
  public vigilanciaCheck;
  public desconhecidoCheck;
  public blockCausaMorte;
  public blockFieldNumProcessoAutopsia;
  public blockFieldDataAutopsia;
  public blockFieldHoraAutopsia;
  public showCausasMorteConfidenciais = false;

  // Inem
  public errorsOnInem;
  public alertsOnInem;

  // Desconhecidos - Residencia Habitual
  private desconhecidoPais: boolean;
  private desconhecidoDistrito: boolean;
  private desconhecidoConcelho: boolean;

  // numCOFetalForSucess
  public numCOFetalForSucess: string;

  // Show Check and Close Icon
  public showCheckMarkIcon;
  public showCloseIcon;

  // Alerts and Erros Inem
  public listAlertasInem;
  public listErrorsInem;

  // Show Close (BIC)
  public showCloseIconBIC;

  // Show CheckMark (BIC)
  public showCheckIconBIC;

  // List Errors and Alerts of the BI or SNS validation
  listErrorsBISNSValidation;
  listAlertsBISNSValidation;

  // List Errors and Alerts of BIC validation
  listErrorsBICValidation;
  listAlertsBICValidation;

  // Icons
  public checkicon: string = 'ios-checkmark-circle';
  public closeicon: string = 'ios-close-circle';
  public identicon: string = iconArrowDown;
  public obitoicon: string = iconArrowDown;
  public causasmorteicon: string = iconArrowDown;
  public dadosrelativosicon: string = iconArrowDown;
  public dadosrelativosmaeicon: string = iconArrowDown;
  public medicoicon: string = iconArrowDown;
  public ministeriopublicoicon: string = iconArrowDown;
  public versoesAnterioresIcon: string = iconArrowDown;

  // Initial List Model
  private initialList: any = [
    {
      label: '<Escolher>',
      value: ''
    }
  ];

  public customDataDataNascimentoMaeOptions: any = {
    buttons: [
      {
        text: 'Cancelar',
        handler: () =>
          this.coFetalForm.controls['dataNascimentoMae'].setValue(null)
      }
    ]
  };

  public customDataPartoAnteriorOptions: any = {
    buttons: [
      {
        text: 'Cancelar',
        handler: () =>
          this.coFetalForm.controls['dataPartoAnterior'].setValue(null)
      }
    ]
  };

  // List Concelho
  residenciaConcelhoList = this.initialList;

  // List Freguesia
  residenciaFreguesiaList = this.initialList;

  // List Concelho
  localObitoConcelhoList = this.initialList;

  // List Freguesia
  localObitoFreguesiaList = this.initialList;

  // List Instituição Saude, Local Obito Parto e Instituição Saude (Morada Profissional)
  instSaudeList;
  LocalObitoPartoList;
  instSaudeMoradaProfList;

  // Booleans
  public errorsOnValidation;
  public alertsOnValidation;
  public controlDisable;
  public controlFieldsFromNUIPC: boolean;
  public controlFieldsDispensaAndNuipc: boolean;
  public showOthersMinPublico: boolean;
  public hideAutopsiaRadioButtons: boolean;
  public blockValuesFromCountry;
  public blockFieldsResidencia;
  public alertResCovid19SuspeitoAux = false;
  public alertLocalObitoInfoAux = false;

  // Show Submit Message
  public showSubmitMessage;
  public showSucessMessage;

  // List Erros/Alertas
  listErrorsValidation;
  listAlertsValidation;

  // Array
  private listHospistais: string[];
  private listHospistaisParto: string[];
  private listHospitaisMoradaProf: string[];

  // Data Emissao
  private dataEmissaoAuxAno;
  private dataEmissaoAuxMes;
  private dataEmissaoAuxDia;

  // Elements
  private elementsErrors: any;
  private elementsAlerts: any;

  // Strings
  public instituicaoSaudeObitoLabel = '<Escolher>';
  public causaMorteLabel = '<Escolher>';
  public instSaudePartoLabel = '<Escolher>';
  public partoFoiLabel = '<Escolher>';
  public instituicaoSaudeMoradaProfissionalLabel = '<Escolher>';
  public instituicaoMoradaProfissionalLabel = '<Escolher>';
  public tipoObitoLabel = '<Escolher>';
  public servicoLabel = '<Escolher>';
  readonly numBIAlertLabel = 'O não preenchimento do número de Identificação Civil pode dificultar a identificação da pessoa falecida e a filiação, tem a certeza que pretende continuar?';
  readonly numUtenteAlertLabel = 'O não preenchimento do Número de Utente do SNS dificulta o reporte do óbito ao Registo Nacional de Utente (RNU), tem a certeza que pretende continuar?';
  readonly numBIAndNumUtenteAlertLabel = 'O Número de Identificação Civil e o Número de Utente do SNS não estão identificados. O não preenchimento de qualquer um dos campos dificulta a identificação da pessoa falecida e a filiação. Tem a certeza que são desconhecidos?';
  readonly localObitoInfoLabel = 'Selecionar «outro local» sempre que o óbito ocorra numa Instituição/Estabelecimento de apoio social e identificar a Instituição/Estabelecimento.';

  // selectOptionsSexo
  public selectOptionsSexo = {
    title: 'Sexo'
  };

  // selectOptionsSexo
  public selectOptionsCriancaNasceu = {
    title: 'A Criança Nasceu'
  };

  public selectOptionsMomentodamorte = {
    title: 'Momento da morte'
  };

  public selectOptionsSenasceudepartogemelar = {
    title: 'Se nasceu de parto gemelar'
  };

  public selectOptinsLocaldoObito = {
    title: 'Local do Óbito'
  };

  public selectOptinsTipoEntidade = {
    title: 'Tipo Entidade'
  };

  public selectOptinsServico = {
    title: 'Serviço'
  };

  public selectOptionsPais = {
    title: 'País'
  };

  public selectOptionsDistrito = {
    title: 'Distrito (em PT)'
  };

  public selectOptionsConcelho = {
    title: 'Concelho (em PT)'
  };

  public selectOptionsFreguesia = {
    title: 'Freguesia (em PT)'
  };

  public selectOptionsClassificacaoMorte = {
    title: 'Classificação da morte'
  };

  public selectOptionsUnidade = {
    title: 'Unidade'
  };

  public selectOptionsCremacao = {
    title: 'Inumação/Cremação'
  };

  public selectOptionsDoencaInfesiosa = {
    title:
      'Existe doença infeciosa, ou outra circunstância suscetível de transmissão por manipulação de cadáver?'
  };

  public selectOptionsAssistencia = {
    title: 'Assistência'
  };

  public selectOptionsLocal = {
    title: 'Local'
  };

  public selectOptionsNatureza = {
    title: 'Natureza'
  };

  public selectOptionsHouveConsultasMedicas = {
    title: 'Houve 3 ou mais consultas médicas?'
  };

  public selectOptionsConsultaRealizada = {
    title: 'A 1ª consulta foi realizada antes da 16ª semana?'
  };

  public selectOptionsExistenciaPatologias = {
    title: 'Existência de patologias'
  };

  public selectOptionsGoodwin = {
    title:
      'Classificação da gravidez de acordo com a escala de Goodwin (última avaliação)'
  };

  public selectOptionsSaudePrimarios = {
    title: 'Cuidados de Saúde Primários'
  };

  public selectOptionsSaudeHospitalares = {
    title: 'Cuidados de Saúde Hospitalares'
  };

  public selectOptionsObstretaPrivado = {
    title: 'Obstretra Privado'
  };

  public selectOptionsVigilanciaPartilhada = {
    title: 'Vigilância Partilhada'
  };

  public selectOptionsMoradaProfissional = {
    title: 'Morada Profissional'
  };

  public selectOptionsTipodecontacto = {
    title: 'Tipo de contacto'
  };

  // DatePicker minimum value for specific cases
  dataPickerMin: any;

  // Form Parsed
  formParsed: any;

  // Data obito checkbox controller
  public dataObitoChkController = 0;

  public listaVersoes;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private msicoWebServices: MsicoWebServicesCofetalProvider,
    private msicoAlerts: MsicoAlertsProvider,
    private msicoLoading: MsicoLoadingProvider,
    private msicoGeneratePDF: MsicoGeneratePdfProvider,
    private formBuilder: FormBuilder,
    public ngZone: NgZone,
    public menuCtrl: MenuController,
    public router: Router
  ) {}

  // Create PDF from base64 string
  pdfHandler(value: string): void {
    if (value === 'ImpressaoGuia') {
      this.msicoLoading.onLoading();

      // Call the web services to get the 64 binary code
      this.msicoWebServices
        .getCOFetalPdf64(this.idCOFetal, 'guia_transporte')
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
    } else if (value === 'ImpressaoCO') {
      this.msicoLoading.onLoading();

      // Call the web services to get the 64 binary code
      this.msicoWebServices
        .getCOFetalPdf64(this.idCOFetal, 'co_fetal')
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
    } else if (value === 'ImpressaoCOCausas') {
      this.msicoLoading.onLoading();

      // Call the web services to get the 64 binary code
      this.msicoWebServices
        .getCOFetalPdf64(this.idCOFetal, 'co_fetal_bpel')
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
    }
  }

  setToUpperCase(tomodified: string, field: string) {
    if (tomodified !== null || tomodified !== undefined) {
      let toUpper = tomodified;

      toUpper = toUpper.toUpperCase();
      toUpper = toUpper.trim();

      this.coFetalForm.controls[field].setValue(toUpper);
    }
  }

  // Init
  ngOnInit() {
    // Add the initialData data from the previous page
    this.ngZone.run(() => {
      //this.initialData = this.navParams.get('detailsList');
      //this.list = this.navParams.get('listDomain');

      if (this.router.getCurrentNavigation().extras.state) {
        const params: any = this.router.getCurrentNavigation().extras.state;
  
        this.initialData = params.detailsList;
        this.list = params.listDomain;
      }
    });

    // If cmConfidenciaisViaCO value is not null, then show info text 'Causas de morte confidenciais'
    if (this.initialData.cmConfidenciaisViaCO !== null) {
      this.showCausasMorteConfidenciais = true;
    }

    this.listaVersoes = this.initialData.listaVersoes;

    this.controlFieldsFromNUIPC = false;
    this.controlFieldsDispensaAndNuipc = false;
    this.desconhecidoPais = false;
    this.desconhecidoConcelho = false;
    this.desconhecidoDistrito = false;

    this.coFetalForm = this.formBuilder.group({
      idCOFetal: new FormControl({
        value: this.initialData.idCOFetal,
        disabled: this.controlDisable
      }),
      coVersaoAnteriorComNuipc: new FormControl({
        value: this.initialData.coVersaoAnteriorComNuipc,
        disabled: this.controlDisable
      }),
      bicComNuipc: new FormControl({
        value: false,
        disabled: this.controlDisable
      }),
      conservatoriaDistrito: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      conservatoriaConcelho: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      conservatoriaDesc: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      conservador: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      numRegisto: new FormControl({ value: '', disabled: this.controlDisable }),
      dataRegisto: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      numCertificado: new FormControl({
        value: this.initialData.numCertificado,
        disabled: this.controlDisable
      }),
      versaoCertificado: new FormControl({
        value: this.initialData.versaoCertificado,
        disabled: this.controlDisable
      }),
      nome: new FormControl({
        value: this.initialData.nome,
        disabled: this.controlDisable
      }),
      nomePai: new FormControl({
        value: this.initialData.nomePai,
        disabled: this.controlDisable
      }),
      nomeMae: new FormControl({
        value: this.initialData.nomeMae,
        disabled: this.controlDisable
      }),
      numBI: new FormControl({
        value: this.initialData.numBI,
        disabled: this.controlDisable
      }),
      numUtente: new FormControl({
        value: this.initialData.numUtente,
        disabled: this.controlDisable
      }),
      resCovid19: new FormControl({
        value: this.initialData.resCovid19,
        disabled: this.controlDisable
      }),
      capituloCmA: new FormControl({
        value: this.initialData.capituloCmA,
        disabled: this.controlDisable
      }),
      grupoCmA: new FormControl({
        value: this.initialData.grupoCmA,
        disabled: this.controlDisable
      }),
      categoriaCmA: new FormControl({
        value: this.initialData.categoriaCmA,
        disabled: this.controlDisable
      }),
      subCategoriaCmA: new FormControl({
        value: this.initialData.subCateogiraCmA,
        disabled: this.controlDisable
      }),
      outroCmA: new FormControl({
        value: this.initialData.outroCmA,
        disabled: this.controlDisable
      }),
      tempoCmA: new FormControl({
        value: this.initialData.tempoCmA,
        disabled: this.controlDisable
      }),
      unidTemporalCmA: new FormControl({
        value: this.initialData.unidTemporalCmA,
        disabled: this.controlDisable
      }),
      capituloCmB: new FormControl({
        value: this.initialData.capituloCmB,
        disabled: this.controlDisable
      }),
      grupoCmB: new FormControl({
        value: this.initialData.grupoCmB,
        disabled: this.controlDisable
      }),
      categoriaCmB: new FormControl({
        value: this.initialData.categoriaCmB,
        disabled: this.controlDisable
      }),
      subCategoriaCmB: new FormControl({
        value: this.initialData.subCategoriaCmB,
        disabled: this.controlDisable
      }),
      outroCmB: new FormControl({
        value: this.initialData.outroCmB,
        disabled: this.controlDisable
      }),
      tempoCmB: new FormControl({
        value: this.initialData.tempoCmB,
        disabled: this.controlDisable
      }),
      unidTemporalCmB: new FormControl({
        value: this.initialData.unidTemporalCmB,
        disabled: this.controlDisable
      }),
      capituloCmC: new FormControl({
        value: this.initialData.capituloCmC,
        disabled: this.controlDisable
      }),
      grupoCmC: new FormControl({
        value: this.initialData.grupoCmC,
        disabled: this.controlDisable
      }),
      categoriaCmC: new FormControl({
        value: this.initialData.categoriaCmC,
        disabled: this.controlDisable
      }),
      subCategoriaCmC: new FormControl({
        value: this.initialData.subCategoriaCmC,
        disabled: this.controlDisable
      }),
      outroCmC: new FormControl({
        value: this.initialData.outroCmC,
        disabled: this.controlDisable
      }),
      tempoCmC: new FormControl({
        value: this.initialData.tempoCmC,
        disabled: this.controlDisable
      }),
      unidTemporalCmC: new FormControl({
        value: this.initialData.unidTemporalCmC,
        disabled: this.controlDisable
      }),
      capituloCmD: new FormControl({
        value: this.initialData.capituloCmD,
        disabled: this.controlDisable
      }),
      grupoCmD: new FormControl({
        value: this.initialData.grupoCmD,
        disabled: this.controlDisable
      }),
      categoriaCmD: new FormControl({
        value: this.initialData.categoriaCmD,
        disabled: this.controlDisable
      }),
      subCategoriaCmD: new FormControl({
        value: this.initialData.subCateforiaCmD,
        disabled: this.controlDisable
      }),
      outroCmD: new FormControl({
        value: this.initialData.outroCmD,
        disabled: this.controlDisable
      }),
      outroCmE: new FormControl({
        value: this.initialData.outroCmE,
        disabled: this.controlDisable
      }),
      tempoCmD: new FormControl({
        value: this.initialData.tempoCmD,
        disabled: this.controlDisable
      }),
      unidTemporalCmD: new FormControl({
        value: this.initialData.unidTemporalCmD,
        disabled: this.controlDisable
      }),
      numCodu: new FormControl({
        value: this.initialData.numCodu,
        disabled: this.controlDisable
      }),
      tipoObito: new FormControl({
        value: this.initialData.tipoObito,
        disabled: this.controlDisable
      }),
      tipoObitoSelected: new FormControl({
        value: this.initialData.tipoObitoSelected,
        disabled: this.controlDisable
      }),
      /* tipoObitoNaoNatural: new FormControl({
        value: this.initialData.tipoObitoNaoNatural,
        disabled: this.controlDisable
      }),
      tipoObitoNatural: new FormControl({
        value: this.initialData.tipoObitoNatural,
        disabled: this.controlDisable
      }), */
      descOutroAcidente: new FormControl({
        value: this.initialData.descOutroAcidente,
        disabled: this.controlDisable
      }),
      sexo: new FormControl({
        value: this.initialData.sexo,
        disabled: this.controlDisable
      }),
      estadoNasc: new FormControl({
        value: this.initialData.estadoNasc,
        disabled: this.controlDisable
      }),
      chkNascDesconhecida: new FormControl({
        value: this.initialData.chkNascDesconhecida,
        disabled: this.controlDisable
      }),
      chkObitoDesconhecida: new FormControl({
        value: this.initialData.chkObitoDesconhecida,
        disabled: this.controlDisable
      }),
      chkHoraObitoDesconhecida: new FormControl({
        value: this.initialData.chkHoraObitoDesconhecida,
        disabled: this.controlDisable
      }),
      chkNascMorta: new FormControl({
        value: this.initialData.chkNascMorta,
        disabled: this.controlDisable
      }),
      nascimentoViva: new FormControl({
        value: this.initialData.nascimentoViva,
        disabled: this.controlDisable
      }),
      nascimentoDiaViva: new FormControl({
        value: this.initialData.nascimentoDiaViva,
        disabled: this.controlDisable
      }),
      nascimentoMesViva: new FormControl({
        value: this.initialData.nascimentoMesViva,
        disabled: this.controlDisable
      }),
      nascimentoAnoViva: new FormControl({
        value: this.initialData.nascimentoAnoViva,
        disabled: this.controlDisable
      }),
      horaNascimentoViva: new FormControl({
        value: this.initialData.horaNascimentoViva,
        disabled: this.controlDisable
      }),
      dataObitoCrianca: new FormControl({
        value: this.initialData.dataObitoCrianca,
        disabled: this.controlDisable
      }),
      diaMorte: new FormControl({
        value: this.initialData.diaMorte,
        disabled: this.controlDisable
      }),
      mesMorte: new FormControl({
        value: this.initialData.mesMorte,
        disabled: this.controlDisable
      }),
      anoMorte: new FormControl({
        value: this.initialData.anoMorte,
        disabled: this.controlDisable
      }),
      horaMorte: new FormControl({
        value: this.initialData.horaMorte,
        disabled: this.controlDisable
      }),
      nascimentoMorta: new FormControl({
        value: this.initialData.nascimentoMorta,
        disabled: this.controlDisable
      }),
      nascimentoDiaMorta: new FormControl({
        value: this.initialData.nascimentoDiaMorta,
        disabled: this.controlDisable
      }),
      nascimentoMesMorta: new FormControl({
        value: this.initialData.nascimentoMesMorta,
        disabled: this.controlDisable
      }),
      nascimentoAnoMorta: new FormControl({
        value: this.initialData.nascimentoAnoMorta,
        disabled: this.controlDisable
      }),
      momentoMorte: new FormControl({
        value: this.initialData.momentoMorte,
        disabled: this.controlDisable
      }),
      baseCausaMorte: new FormControl({
        value: this.initialData.baseCausaMorte,
        disabled: this.controlDisable
      }),
      dataAutopsia: new FormControl({
        value: this.initialData.dataAutopsia,
        disabled: this.controlDisable
      }),
      horaAutopsia: new FormControl({
        value: this.initialData.horaAutopsia,
        disabled: this.controlDisable
      }),
      numProcessoAutopsia: new FormControl({
        value: this.initialData.numProcessoAutopsia,
        disabled: this.controlDisable
      }),
      peso: new FormControl({
        value: this.initialData.peso,
        disabled: this.controlDisable
      }),
      pesoIgnorado: new FormControl({
        value: this.initialData.pesoIgnorado,
        disabled: this.controlDisable
      }),
      localObito: new FormControl({
        value: this.initialData.localObito,
        disabled: this.controlDisable
      }),
      txt_ho_scoreApgar1: new FormControl({
        value: this.initialData.txt_ho_scoreApgar1,
        disabled: this.controlDisable
      }),
      txt_ho_scoreApgar5: new FormControl({
        value: this.initialData.txt_ho_scoreApgar5,
        disabled: this.controlDisable
      }),
      txt_ho_scoreApgar10: new FormControl({
        value: this.initialData.txt_ho_scoreApgar10,
        disabled: this.controlDisable
      }),
      chkIndiceApgarDesconhecido: new FormControl({
        value: this.initialData.chkIndiceApgarDesconhecido,
        disabled: this.controlDisable
      }),
      classificacaoMorte: new FormControl({
        value: this.initialData.classificacaoMorte,
        disabled: this.controlDisable
      }),
      classificacaoMorteMalf: new FormControl({
        value: this.initialData.classificacaoMorteMalf,
        disabled: this.controlDisable
      }),
      idHospitaisObito: new FormControl({
        value: this.initialData.idHospitaisObito,
        disabled: this.controlDisable
      }),
      idUACObito: new FormControl({
        value: this.initialData.idUACObito,
        disabled: this.controlDisable
      }),
      idOutroObito: new FormControl({
        value: this.initialData.idOutroObito,
        disabled: this.controlDisable
      }),
      descLocalObito: new FormControl({
        value: this.initialData.descLocalObito,
        disabled: this.controlDisable
      }),
      partoGemeos: new FormControl({
        value: this.initialData.partoGemeos,
        disabled: this.controlDisable
      }),
      inumacaoCremacao: new FormControl({
        value: this.initialData.inumacaoCremacao,
        disabled: this.controlDisable
      }),
      motivoInumCrem: new FormControl({
        value: this.initialData.motivoInumCrem,
        disabled: this.controlDisable
      }),
      doencaInfeciosa: new FormControl({
        value: this.initialData.doencaInfeciosa,
        disabled: this.controlDisable
      }),
      dataParto: new FormControl({
        value: this.initialData.dataParto,
        disabled: this.controlDisable
      }),
      dataObito: new FormControl({
        value: this.initialData.dataObito,
        disabled: this.controlDisable
      }),
      localParto: new FormControl({
        value: this.initialData.localParto,
        disabled: this.controlDisable
      }),
      tipoEntidadeParto: new FormControl({
        value: this.initialData.tipoEntidadeParto,
        disabled: this.controlDisable
      }),
      idHospitalParto: new FormControl({
        value: this.initialData.idHospitalParto,
        disabled: this.controlDisable
      }),
      descLocalParto: new FormControl({
        value: this.initialData.descLocalParto,
        disabled: this.controlDisable
      }),
      assistencia: new FormControl({
        value: this.initialData.assistencia,
        disabled: this.controlDisable
      }),
      naturezaParto: new FormControl({
        value: this.initialData.naturezaParto,
        disabled: this.controlDisable
      }),
      numGemeos: new FormControl({
        value: this.initialData.numGemeos,
        disabled: this.controlDisable
      }),
      numNadosVivos: new FormControl({
        value: this.initialData.numNadosVivos,
        disabled: this.controlDisable
      }),
      numFetosMortos: new FormControl({
        value: this.initialData.numFetosMortos,
        disabled: this.controlDisable
      }),
      tipoParto: new FormControl({
        value: this.initialData.tipoParto,
        disabled: this.controlDisable
      }),
      outroTipoParto: new FormControl({
        value: this.initialData.outroTipoParto,
        disabled: this.controlDisable
      }),
      duracaoGravidez: new FormControl({
        value: this.initialData.duracaoGravidez,
        disabled: this.controlDisable
      }),
      duracaoGravidezIgnorado: new FormControl({
        value: this.initialData.duracaoGravidezIgnorado,
        disabled: this.controlDisable
      }),
      descDuracaoMotivo: new FormControl({
        value: this.initialData.descDuracaoMotivo,
        disabled: this.controlDisable
      }),
      vigilanciaAntenatal: new FormControl({
        value: this.initialData.vigilanciaAntenatal,
        disabled: this.controlDisable
      }),
      indPrimeiraConsulta: new FormControl({
        value: this.initialData.indPrimeiraConsulta,
        disabled: this.controlDisable
      }),
      focoFetal: new FormControl({
        value: this.initialData.focoFetal,
        disabled: this.controlDisable
      }),
      chkFocoFetalDesconhecido: new FormControl({
        value: this.initialData.chkFocoFetalDesconhecido,
        disabled: this.controlDisable
      }),
      duracaoParto: new FormControl({
        value: this.initialData.duracaoParto,
        disabled: this.controlDisable
      }),
      chkDuracaoPartoDesconhecido: new FormControl({
        value: this.initialData.chkDuracaoPartoDesconhecido,
        disabled: this.controlDisable
      }),
      dataNascimentoMae: new FormControl({
        value: this.initialData.dataNascimentoMae,
        disabled: this.controlDisable
      }),
      dataPartoAnterior: new FormControl({
        value: this.initialData.dataPartoAnterior,
        disabled: this.controlDisable
      }),
      numPartosTermo: new FormControl({
        value: this.initialData.numPartosTermo,
        disabled: this.controlDisable
      }),
      numPartosPreTermo: new FormControl({
        value: this.initialData.numPartosPreTermo,
        disabled: this.controlDisable
      }),
      numAbortos: new FormControl({
        value: this.initialData.numAbortos,
        disabled: this.controlDisable
      }),
      numFilhosVivos: new FormControl({
        value: this.initialData.numFilhosVivos,
        disabled: this.controlDisable
      }),
      residenciaMorada: new FormControl({
        value: this.initialData.residenciaMorada,
        disabled: this.controlDisable
      }),
      residenciaDistrito: new FormControl({
        value: this.initialData.residenciaDistrito,
        disabled: this.controlDisable
      }),
      residenciaConcelho: new FormControl({
        value: this.initialData.residenciaConcelho,
        disabled: this.controlDisable
      }),
      residenciaFreguesia: new FormControl({
        value: this.initialData.residenciaFreguesia,
        disabled: this.controlDisable
      }),
      residenciaPais: new FormControl({
        value: this.initialData.residenciaPais,
        disabled: this.controlDisable
      }),
      patologias: new FormControl({
        value: this.initialData.patologias,
        disabled: this.controlDisable
      }),
      cbPatHipArt: new FormControl({
        value: this.initialData.cbPatHipArt,
        disabled: this.controlDisable
      }),
      cbPatDiaGes: new FormControl({
        value: this.initialData.cbPatDiaGes,
        disabled: this.controlDisable
      }),
      cbPatDiaMel1: new FormControl({
        value: this.initialData.cbPatDiaMel1,
        disabled: this.controlDisable
      }),
      cbPatDiaMel2: new FormControl({
        value: this.initialData.cbPatDiaMel2,
        disabled: this.controlDisable
      }),
      cbPatDoeMental: new FormControl({
        value: this.initialData.cbPatDoeMental,
        disabled: this.controlDisable
      }),
      cbPatDoeNeuro: new FormControl({
        value: this.initialData.cbPatDoeNeuro,
        disabled: this.controlDisable
      }),
      cbPatInfTransSex: new FormControl({
        value: this.initialData.cbPatInfTransSex,
        disabled: this.controlDisable
      }),
      cbPatObesidade: new FormControl({
        value: this.initialData.cbPatObesidade,
        disabled: this.controlDisable
      }),
      cbPatOutra: new FormControl({
        value: this.initialData.cbPatOutra,
        disabled: this.controlDisable
      }),
      patOutraDesc: new FormControl({
        value: this.initialData.patOutraDesc,
        disabled: this.controlDisable
      }),
      goodwin: new FormControl({
        value: this.initialData.goodwin,
        disabled: this.controlDisable
      }),
      vigilCSPrimarios: new FormControl({
        value: this.initialData.vigilCSPrimarios,
        disabled: this.controlDisable
      }),
      vigilCSHospitalares: new FormControl({
        value: this.initialData.vigilCSHospitalares,
        disabled: this.controlDisable
      }),
      vigilObstPriv: new FormControl({
        value: this.initialData.vigilObstPriv,
        disabled: this.controlDisable
      }),
      vigilVPart: new FormControl({
        value: this.initialData.vigilVPart,
        disabled: this.controlDisable
      }),
      cbSemVigilancia: new FormControl({
        value: this.initialData.cbSemVigilancia,
        disabled: this.controlDisable
      }),
      cbVigilDesconhecida: new FormControl({
        value: this.initialData.cbVigilDesconhecida,
        disabled: this.controlDisable
      }),
      observacoes: new FormControl({
        value: this.initialData.observacoes,
        disabled: this.controlDisable
      }),
      observacoesInfoClinica: new FormControl({
        value: this.initialData.observacoesInfoClinica,
        disabled: this.controlDisable
      }),
      nomeClinico: new FormControl({
        value: this.initialData.nomeClinico,
        disabled: true
      }),
      codigoInmlProfissional: new FormControl({
        value: this.initialData.codigoInmlProfissional,
        disabled: this.controlDisable
      }),
      codigoSaudeProfissional: new FormControl({
        value: this.initialData.codigoSaudeProfissional,
        disabled: this.controlDisable
      }),
      moradaClinico: new FormControl({
        value: this.initialData.moradaClinico,
        disabled: this.controlDisable
      }),
      numCedulaProfissional: new FormControl({
        value: this.initialData.numCedulaProfissional,
        disabled: true
      }),
      tipoContacto: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      descContacto: new FormControl({
        value: this.initialData.descContacto,
        disabled: this.controlDisable
      }),
      dataEmissao: new FormControl({
        value: this.initialData.dataEmissao,
        disabled: true
      }),
      horaEmissao: new FormControl({
        value: this.initialData.horaEmissao,
        disabled: true
      }),
      nuipc: new FormControl({
        value: this.initialData.nuipc,
        disabled: this.controlDisable
      }),
      numBIC: new FormControl({
        value: this.initialData.numBIC,
        disabled: this.controlDisable
      }),
      operacao: new FormControl({
        value: this.initialData.operacao,
        disabled: this.controlDisable
      }),
      cmConfidenciais: new FormControl({
        value: this.initialData.cmConfidenciais,
        disabled: this.controlDisable
      }),
      estadoIRN: new FormControl({
        value: this.initialData.estadoIRN,
        disabled: this.controlDisable
      }),
      dataEstadoIRN: new FormControl({
        value: this.initialData.dataEstadoIRN,
        disabled: this.controlDisable
      }),
      estadoINE: new FormControl({
        value: this.initialData.estadoINE,
        disabled: this.controlDisable
      }),
      dataEstadoINE: new FormControl({
        value: this.initialData.dataEstadoINE,
        disabled: this.controlDisable
      }),
      estadoRNU: new FormControl({
        value: this.initialData.estadoRNU,
        disabled: this.controlDisable
      }),
      dataEstadoRNU: new FormControl({
        value: this.initialData.dataEstadoRNU,
        disabled: this.controlDisable
      }),
      mensagemIRN: new FormControl({
        value: this.initialData.mensagemIRN,
        disabled: this.controlDisable
      }),
      mensagemRNU: new FormControl({
        value: this.initialData.mensagemRNU,
        disabled: this.controlDisable
      }),
      mensagemINE: new FormControl({
        value: this.initialData.mensagemINE,
        disabled: this.controlDisable
      }),
      novoEstadoIRN: new FormControl({
        value: this.initialData.novoEstadoIRN,
        disabled: this.controlDisable
      }),
      novoEstadoRNU: new FormControl({
        value: this.initialData.novoEstadoRNU,
        disabled: this.controlDisable
      }),
      novoEstadoINE: new FormControl({
        value: this.initialData.novoEstadoINE,
        disabled: this.controlDisable
      }),
      tempoA: new FormControl({
        value: this.initialData.tempoA,
        disabled: this.controlDisable
      }),
      unidTempoA: new FormControl({
        value: this.initialData.unidTempoA,
        disabled: this.controlDisable
      }),
      tempoB: new FormControl({
        value: this.initialData.tempoB,
        disabled: this.controlDisable
      }),
      unidTempoB: new FormControl({
        value: this.initialData.unidTempoB,
        disabled: this.controlDisable
      }),
      tempoC: new FormControl({
        value: this.initialData.tempoC,
        disabled: this.controlDisable
      }),
      unidTempoC: new FormControl({
        value: this.initialData.unidTempoC,
        disabled: this.controlDisable
      }),
      tempoD: new FormControl({
        value: this.initialData.tempoD,
        disabled: this.controlDisable
      }),
      unidTempoD: new FormControl({
        value: this.initialData.unidTempoD,
        disabled: this.controlDisable
      }),
      tempoE: new FormControl({
        value: this.initialData.tempoE,
        disabled: this.controlDisable
      }),
      unidTempoE: new FormControl({
        value: this.initialData.unidTempoE,
        disabled: this.controlDisable
      }),
      freguesiaLocalObito: new FormControl({
        value: this.initialData.freguesiaLocalObito,
        disabled: this.controlDisable
      }),
      concelhoLocalObito: new FormControl({
        value: this.initialData.concelhoLocalObito,
        disabled: this.controlDisable
      }),
      distritoLocalObito: new FormControl({
        value: this.initialData.distritoLocalObito,
        disabled: this.controlDisable
      }),
      paisLocalObito: new FormControl({
        value: this.initialData.paisLocalObito,
        disabled: this.controlDisable
      }),
      dispensaAutopsia: new FormControl({
        value: this.initialData.dispensaAutopsia,
        disabled: this.controlDisable
      }),
      estadoDecisaoMP: new FormControl({
        value: this.initialData.estadoDecisaoMP,
        disabled: this.controlDisable
      }),
      utilizadorAlteracaoMP: new FormControl({
        value: this.initialData.utilizadorAlteracaoMP,
        disabled: this.controlDisable
      }),
      chkMoradaRDesconhecida: new FormControl({
        value: this.initialData.chkMoradaRDesconhecida,
        disabled: this.controlDisable
      }),
      chkPaisRDesconhecida: new FormControl({
        value: this.initialData.chkPaisRDesconhecida,
        disabled: this.controlDisable
      }),
      chkDistritoRDesconhecida: new FormControl({
        value: this.initialData.chkDistritoRDesconhecida,
        disabled: this.controlDisable
      }),
      chkConcelhoRDesconhecida: new FormControl({
        value: this.initialData.chkConcelhoRDesconhecida,
        disabled: this.controlDisable
      }),
      chkFreguesiaRDesconhecida: new FormControl({
        value: this.initialData.chkFreguesiaRDesconhecida,
        disabled: this.controlDisable
      }),
      idServicoObito: new FormControl({
        value: this.initialData.idServicoObito,
        disabled: this.controlDisable
      }),
      descServicoObitoOutro: new FormControl({
        value: this.initialData.descServicoObitoOutro,
        disabled: this.controlDisable
      }),
      idMoradaProfissionalServicoObito: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      descMoradaProfissionalServicoOutro: new FormControl({
        value: this.initialData.descMoradaProfissionalServicoOutro,
        disabled: this.controlDisable
      }),
      ativarCid: new FormControl({
        value: this.initialData.ativarCid,
        disabled: this.controlDisable
      }),
      selectEntidadeObito: new FormControl({
        value: this.initialData.selectEntidadeObito,
        disabled: this.controlDisable
      }),
      selectEntidade: new FormControl({
        value: this.initialData.selectEntidade,
        disabled: this.controlDisable
      }),
      tipoEntidadeSelecionada: new FormControl({
        value: this.initialData.tipoEntidadeSelecionada,
        disabled: this.controlDisable
      })
    });

    this.elementsErrors = document.getElementsByClassName(
      'errorValidationItem'
    );
    this.elementsAlerts = document.getElementsByClassName(
      'alertValidationItem'
    );

    // Local Obito List
    this.localObitoConcelhoList = this.list.localObitoConcelho;
    this.localObitoFreguesiaList = this.list.localObitoFreguesia;

    // List Concelho and Freguesia (Residencia)
    this.residenciaConcelhoList = this.list.residenciaConcelho;
    this.residenciaFreguesiaList = this.list.residenciaFreguesia;

    this.populateInstSaudePartoList();

    this.instSaudePartoLabel = this.initialData.idHospitalPartoDesc;
    this.coFetalForm.patchValue({
      idHospitalParto: this.initialData.idHospitalParto
    });

    let dateString = this.coFetalForm.get('dataEmissao').value.split('-');

    let dataEmissao = new Date(
      dateString[2],
      dateString[1] - 1,
      dateString[0]
    ).toISOString();

    this.dataEmissaoAuxAno = dateString[2];
    this.dataEmissaoAuxMes = ('0' + dateString[1]).slice(-2);
    this.dataEmissaoAuxDia = dateString[0];

    // Data Obito (Ano, Mes, Dia)
    if (this.initialData.nascimentoAnoMorta) {
      this.coFetalForm.patchValue({
        nascimentoMorta:
          this.initialData.nascimentoAnoMorta +
          '-' +
          this.initialData.nascimentoMesMorta +
          '-' +
          this.initialData.nascimentoDiaMorta
      });
    }

    // Dates for fill needs to be parsed (nascimentoViva)
    if (this.initialData.nascimentoAnoViva) {
      this.coFetalForm.patchValue({
        nascimentoViva:
          this.pad(this.initialData.nascimentoAnoViva, 2, 0) +
          '-' +
          this.pad(this.initialData.nascimentoMesViva, 2, 0) +
          '-' +
          this.pad(this.initialData.nascimentoDiaViva, 2, 0)
      });
    }

    // Dates for fill needs to be parsed (dataObitoCrianca)
    if (this.initialData.anoMorte) {
      this.coFetalForm.patchValue({
        dataObitoCrianca:
          this.pad(this.initialData.anoMorte, 2, 0) +
          '-' +
          this.pad(this.initialData.mesMorte, 2, 0) +
          '-' +
          this.pad(this.initialData.diaMorte, 2, 0)
      });
    }

    // Data Autopsia (Ano, Mes, Dia)
    if (this.initialData.dataAutopsia) {
      this.coFetalForm.patchValue({
        dataAutopsia:
          this.dateChangeFormat(this.initialData.dataAutopsia)[2] +
          '-' +
          this.dateChangeFormat(this.initialData.dataAutopsia)[1] +
          '-' +
          this.dateChangeFormat(this.initialData.dataAutopsia)[0]
      });
    }

    if (this.initialData.dataParto) {
      let dataPartoSplited = this.coFetalForm.get('dataParto').value.split('-');

      this.coFetalForm.controls['dataParto'].setValue(
        dataPartoSplited[2] +
          '-' +
          dataPartoSplited[1] +
          '-' +
          dataPartoSplited[0]
      );
    }

    this.populateInstSaudeList();

    if (this.initialData.selectEntidadeObito === '1') {
      this.instituicaoSaudeObitoLabel = this.initialData.idHospitaisObitoDesc;
    } else if (this.initialData.selectEntidadeObito === '2') {
      this.instituicaoSaudeObitoLabel = this.initialData.idUACObitoDesc;
    } else if (this.initialData.selectEntidadeObito === '3') {
      this.instituicaoSaudeObitoLabel = this.initialData.idOutroObitoDesc;
    }

    if (this.coFetalForm.get('selectEntidadeObito').value === '1') {
      this.coFetalForm.patchValue({
        idHospitaisObito: this.initialData.idHospitaisObito
      });
    } else if (this.coFetalForm.get('selectEntidadeObito').value === '2') {
      this.coFetalForm.patchValue({ idUACObito: this.initialData.idUACObito });
    } else if (this.coFetalForm.get('selectEntidadeObito').value === '3') {
      this.coFetalForm.patchValue({
        idOutroObito: this.initialData.idOutroObito
      });
    }

    this.coFetalForm.patchValue({
      idServicoObito: this.initialData.idServicoObito
    });

    if (this.initialData.dataNascimentoMae) {
      // Split the value date of dataNascimentoMae
      let dataNascimentoMaeSplited = this.coFetalForm
        .get('dataNascimentoMae')
        .value.split('-');

      // Change the string for the format YYYY/MM/DD
      this.coFetalForm.patchValue({
        dataNascimentoMae:
          dataNascimentoMaeSplited[2] +
          '-' +
          dataNascimentoMaeSplited[1] +
          '-' +
          dataNascimentoMaeSplited[0]
      });
    }

    if (this.coFetalForm.get('dataPartoAnterior').value) {
      // Split the value date of dataPartoAnterior
      let dataPartoAnteriorSplited = this.coFetalForm
        .get('dataPartoAnterior')
        .value.split('-');

      // Change the string for the format YYYY/MM/DD
      this.coFetalForm.patchValue({
        dataPartoAnterior:
          dataPartoAnteriorSplited[2] +
          '-' +
          dataPartoAnteriorSplited[1] +
          '-' +
          dataPartoAnteriorSplited[0]
      });
    }

    // Tipo Obito Selected Label
    this.tipoObitoLabel = this.initialData.tipoObitoSelectedDesc;

    // Causa da Morte Selected Label
    this.causaMorteLabel = this.initialData.baseCausaMorteDesc;

    // Ano Morte
    this.coFetalForm.patchValue({
      anoMorte: this.initialData.anoMorte
    });

    // Mes Morte
    this.coFetalForm.patchValue({
      mesMorte: this.initialData.mesMorte
    });

    // Dia Morte
    this.coFetalForm.patchValue({
      diaMorte: this.initialData.diaMorte
    });

    // Residencia Distrito
    this.coFetalForm.patchValue({
      residenciaDistrito: this.initialData.residenciaDistrito
    });

    // Residencia Concelho
    this.coFetalForm.patchValue({
      residenciaConcelho: this.initialData.residenciaConcelho
    });

    // NUIPC
    if (this.initialData.coVersaoAnteriorComNuipc) {
      this.controlFieldsFromNUIPC = true;
      this.controlFieldsDispensaAndNuipc = true;
      this.showOthersMinPublico = false;
      this.hideAutopsiaRadioButtons = true;
    } else {
      this.controlFieldsFromNUIPC = true;
      this.controlFieldsDispensaAndNuipc = false;
      this.showOthersMinPublico = true;
      this.hideAutopsiaRadioButtons = false;
    }

    this.dataPickerMin = (parseInt(this.dataEmissaoAuxAno) - 8).toString();

    if (this.coFetalForm.get('baseCausaMorte').value) {
      if (this.coFetalForm.get('baseCausaMorte').value === '2' || this.coFetalForm.get('baseCausaMorte').value === '3') {
        this.camposAutopsiaFieldBlock();
      }
    }

    if (this.coFetalForm.get('tipoParto').value) {
      this.partoFoiLabel = this.initialData.tipoPartoDesc;
    }

    // Check if resCovid19 field is already with "Suspeito" option
    if (this.coFetalForm.get('resCovid19').value === 'S') {
      this.alertResCovid19SuspeitoAux = true;
    }

    // Check if localObito field is already with value
    if (this.coFetalForm.get('localObito').value) {
      this.alertLocalObitoInfoAux = true;
    }
  }

  // Handles the date of the birth dead
  nascimentoMortaDateHandler(): void {
    // Clean Nascimento Morta
    this.coFetalForm.patchValue({ nascimentoAnoViva: '' });
    this.coFetalForm.patchValue({ horaNascimentoViva: '' });
    this.coFetalForm.patchValue({ chkNascDesconhecida: false });
    // this.coFetalForm.patchValue({ dataObitoCrianca: '' });
    // this.coFetalForm.patchValue({ chkObitoDesconhecida: false });
    // this.coFetalForm.patchValue({ horaMorte: '' });
    // this.coFetalForm.patchValue({ chkHoraObitoDesconhecida: false });

    if (this.coFetalForm.get('nascimentoMorta').value) {
      let dataNascimentoMorta = new Date(
        this.coFetalForm.get('nascimentoMorta').value
      );

      this.coFetalForm.patchValue({
        nascimentoAnoMorta: dataNascimentoMorta.getFullYear().toString()
      });

      this.coFetalForm.patchValue({
        nascimentoMesMorta: ('0' + (dataNascimentoMorta.getMonth() + 1)).slice(
          -2
        )
      });

      this.coFetalForm.patchValue({
        nascimentoDiaMorta: ('0' + dataNascimentoMorta.getDate()).slice(-2)
      });
    }
  }

  onBlur($event): void {

    this.cleanPaintErrors();
    this.cleanPaintAlerts();

    if ($event.value !== undefined && $event.value !== '') {
      if ($event.ngControl.name === 'numBIC') {
        this.getDataBICHandler();
      } else if (
        $event.ngControl.name === 'numBI' ||
        $event.ngControl.name === 'numUtente'
      ) {
        this.getDadosFalecidoCOFetalHandler();
      }
    } else if ($event.value === '') {
      if ($event.ngControl.name === 'numBIC') {
        this.showCheckIconBIC = false;
        this.showCloseIconBIC = false;
        // this.controlFieldsFromNUIPC = false;
        // this.controlFieldsDispensaAndNuipc = false;

        // this.listErrorsBICValidation = null;
        // this.listAlertsBICValidation = null;

        this.getDataBICHandler();
      } else if (
        $event.ngControl.name === 'numBI' ||
        $event.ngControl.name === 'numUtente'
      ) {
        this.listAlertsBISNSValidation = null;
        this.listErrorsBISNSValidation = null;

        this.showCloseIcon = false;
        this.showCheckMarkIcon = false;

        this.cleanDataFromUtenteOrNIC();
      }
    }
  }

  // Handles the date of the birth alive
  nascimentoVivaHandler() {
    // Clean Nascimento Morta
    this.coFetalForm.patchValue({ nascimentoAnoMorta: '' });
    this.coFetalForm.patchValue({ chkNascMorta: false });
    this.coFetalForm.patchValue({ momentoMorte: '' });

    if (this.coFetalForm.get('nascimentoViva').value) {
      let dataNascimentoViva = new Date(
        this.coFetalForm.controls['nascimentoViva'].value
      );

      this.coFetalForm.patchValue({
        nascimentoAnoViva: dataNascimentoViva.getFullYear().toString()
      });

      this.coFetalForm.patchValue({
        nascimentoMesViva: ('0' + (dataNascimentoViva.getMonth() + 1)).slice(-2)
      });

      this.coFetalForm.patchValue({
        nascimentoDiaViva: ('0' + dataNascimentoViva.getDate()).slice(-2)
      });
    }
  }

  // Handles the date of the death
  dataObitoHandler(): void {
    // If handler has been called then change the dataObitoChkController value
    this.dataObitoChkController = 1;

    if (this.coFetalForm.controls['dataObitoCrianca'].value) {
      let dataObito = new Date(
        this.coFetalForm.controls['dataObitoCrianca'].value
      );

      this.coFetalForm.patchValue({
        anoMorte: dataObito.getFullYear().toString()
      });

      this.coFetalForm.patchValue({
        mesMorte: ('0' + (dataObito.getMonth() + 1)).slice(-2)
      });

      this.coFetalForm.patchValue({
        diaMorte: ('0' + dataObito.getDate()).slice(-2)
      });
    }

    // Extra remove loading method to prevent loading controller malfunction
    this.msicoLoading.onLoadingRemove();

      if (this.coFetalForm.get('dataObitoCrianca').value !== null) {
        this.msicoLoading.onLoading();

        this.msicoWebServices
          .getListDomEspecificoCOFetalDataObitoServices(
            this.coFetalForm.get('anoMorte').value,
            this.coFetalForm.get('mesMorte').value,
            this.coFetalForm.get('diaMorte').value,
            this.coFetalForm.get('distritoLocalObito').value,
            this.coFetalForm.get('concelhoLocalObito').value,
            this.coFetalForm.get('residenciaDistrito').value,
            this.coFetalForm.get('residenciaConcelho').value,
            this.dataEmissaoAuxAno,
            this.dataEmissaoAuxMes,
            this.dataEmissaoAuxDia
          )
          .subscribe(
            data => {
              let dataRetrieved: any = data;

              this.list.residenciaPais = dataRetrieved.dadosOutput.listaPaises;

              if (dataRetrieved.dadosOutput.listaDistritos) {
                // Check if residenciaDistrito's value exists in new residenciaDistrito list from server (if not, clean associated fields)
                let residenciaDistritoServerList = dataRetrieved.dadosOutput.listaDistritos.map(a => a.value);
                if (!residenciaDistritoServerList.includes(this.coFetalForm.get('residenciaDistrito').value)) {
                  this.coFetalForm.patchValue({ residenciaDistrito: '' });
                  this.coFetalForm.patchValue({ residenciaConcelho: '' });
                  this.coFetalForm.patchValue({ residenciaFreguesia: '' });
                }
                this.list.listaDistritos =
                  dataRetrieved.dadosOutput.listaDistritos;
              }

              if (dataRetrieved.dadosOutput.residenciaConcelho) {
                // Check if residenciaConcelho's value exists in new residenciaConcelho list from server (if not, clean associated fields)
                let residenciaConcelhoServerList = dataRetrieved.dadosOutput.residenciaConcelho.map(a => a.value);
                if (!residenciaConcelhoServerList.includes(this.coFetalForm.get('residenciaConcelho').value)) {
                  this.coFetalForm.patchValue({ residenciaConcelho: '' });
                  this.coFetalForm.patchValue({ residenciaFreguesia: '' });
                }
                this.residenciaConcelhoList =
                  dataRetrieved.dadosOutput.residenciaConcelho;
              }

              if (dataRetrieved.dadosOutput.residenciaFreguesia) {
                // Check if residenciaFreguesia's value exists in new residenciaFreguesia list from server (if not, clean associated fields)
                let residenciaFreguesiaServerList = dataRetrieved.dadosOutput.residenciaFreguesia.map(a => a.value);
                if (!residenciaFreguesiaServerList.includes(this.coFetalForm.get('residenciaFreguesia').value)) {
                  this.coFetalForm.patchValue({ residenciaFreguesia: '' });
                }
                this.residenciaFreguesiaList =
                  dataRetrieved.dadosOutput.residenciaFreguesia;
              }

              if (dataRetrieved.dadosOutput.listaDistritos) {
                // Check if distritoLocalObito's value exists in new localObitoDistrito list from server (if not, clean associated fields)
                let localObitoDistritoServerList = dataRetrieved.dadosOutput.listaDistritos.map(a => a.value);
                if (!localObitoDistritoServerList.includes(this.coFetalForm.get('distritoLocalObito').value)) {
                  this.coFetalForm.patchValue({ distritoLocalObito: '' });
                  this.coFetalForm.patchValue({ concelhoLocalObito: '' });
                  this.coFetalForm.patchValue({ freguesiaLocalObito: '' });
                }

                this.list.listaDistritos =
                  dataRetrieved.dadosOutput.listaDistritos;
              }

              if (dataRetrieved.dadosOutput.localObitoConcelho) {
                // Check if concelhoLocalObito's value exists in new localObitoConcelho list from server (if not, clean associated fields)
                let localObitoConcelhoServerList = dataRetrieved.dadosOutput.localObitoConcelho.map(a => a.value);
                if (!localObitoConcelhoServerList.includes(this.coFetalForm.get('concelhoLocalObito').value)) {
                  this.coFetalForm.patchValue({ concelhoLocalObito: '' });
                  this.coFetalForm.patchValue({ freguesiaLocalObito: '' });
                }

                this.localObitoConcelhoList =
                  dataRetrieved.dadosOutput.localObitoConcelho;
              }

              if (dataRetrieved.dadosOutput.localObitoFreguesia) {
                // Check if freguesiaLocalObito's value exists in new localObitoFreguesia list from server (if not, clean associated fields)
                let localObitoFreguesiaServerList = dataRetrieved.dadosOutput.localObitoFreguesia.map(a => a.value);
                if (!localObitoFreguesiaServerList.includes(this.coFetalForm.get('freguesiaLocalObito').value)) {
                  this.coFetalForm.patchValue({ freguesiaLocalObito: '' });
                }

                this.localObitoFreguesiaList =
                  dataRetrieved.dadosOutput.localObitoFreguesia;
              }
              this.msicoLoading.onLoadingRemove();
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

  // Validate inputs from baseCausaMorte field
  camposAutopsiaFieldBlock(): void {
    if (this.initialData.numProcessoAutopsiaViaRegistoAutopsia) {
      this.coFetalForm.patchValue({ numProcessoAutopsia: this.initialData.numProcessoAutopsiaViaRegistoAutopsia });
      this.blockFieldNumProcessoAutopsia = true;
    } else {
      this.blockFieldNumProcessoAutopsia = false;
    }

    if (this.initialData.dataAutopsiaViaRegistoAutopsia) {
      this.coFetalForm.patchValue({ dataAutopsia:
        this.dateChangeFormat(this.initialData.dataAutopsiaViaRegistoAutopsia)[2] +
        '-' +
        this.dateChangeFormat(this.initialData.dataAutopsiaViaRegistoAutopsia)[1] +
        '-' +
        this.dateChangeFormat(this.initialData.dataAutopsiaViaRegistoAutopsia)[0]
      })
      this.blockFieldDataAutopsia = true;
    } else {
      this.blockFieldDataAutopsia = false;
    }
    if (this.initialData.horaAutopsiaViaRegistoAutopsia) {
      this.coFetalForm.patchValue({ horaAutopsia: this.initialData.horaAutopsiaViaRegistoAutopsia });
      this.blockFieldHoraAutopsia = true;
    } else {
      this.blockFieldHoraAutopsia = false;
    }
  }

  // It handles the show and hide sections of the form
  accordionHandler(sectionDescription: string): void {
    // Identificacao
    if (sectionDescription === 'identFale') {
      this.identFale = !this.identFale;
      this.identicon = this.identFale ? iconArrowUp : iconArrowDown;
    }
    // Óbito
    if (sectionDescription === 'obito') {
      this.obito = !this.obito;
      this.obitoicon = this.obito ? iconArrowUp : iconArrowDown;
    }
    // Causas da Morte
    if (sectionDescription === 'causaMorte') {
      this.causaMorte = !this.causaMorte;
      this.causasmorteicon = this.causaMorte ? iconArrowUp : iconArrowDown;
    }
    // Dados Relativos
    if (sectionDescription === 'dadosRelativos') {
      this.dadosRelativos = !this.dadosRelativos;
      this.dadosrelativosicon = this.dadosRelativos
        ? iconArrowUp
        : iconArrowDown;
    }
    // Dados relativos à mãe do feto ou da criança
    if (sectionDescription === 'dadosRelativosMae') {
      this.dadosRelativosMae = !this.dadosRelativosMae;
      this.dadosrelativosmaeicon = this.dadosRelativosMae
        ? iconArrowUp
        : iconArrowDown;
    }
    // Médico
    if (sectionDescription === 'medico') {
      this.medico = !this.medico;
      this.medicoicon = this.medico ? iconArrowUp : iconArrowDown;
    }
    // Ministério Público
    if (sectionDescription === 'ministerioPublico') {
      this.ministerioPublico = !this.ministerioPublico;
      this.ministeriopublicoicon = this.ministerioPublico
        ? iconArrowUp
        : iconArrowDown;
    }
    // Versões Anteriores
    if (sectionDescription === 'versoesAnteriores') {
      this.versoesAnteriores = !this.versoesAnteriores;
      this.versoesAnterioresIcon = this.versoesAnteriores
        ? iconArrowUp
        : iconArrowDown;
    }
  }

  // When clicked scroll to Top
  scrollToTop(): void {
    //this.content.scrollToTop();
  }

  // When clicked scroll to Bottom
  scrollToBottom(): void {
    //this.content.scrollToBottom();
  }

  // By clicking on the error list
  clickToTheField(value): void {
    let top = document.getElementById(value[0]).offsetTop;

    if (top !== 0) {
      //this.content.scrollTo(0, top - 10, 1000);
    }
  }

  getCOFetalFichaInemPdf64(): void {
    this.msicoLoading.onLoading();

    let numCodu = this.coFetalForm.get('numCodu').value;

    this.alertsOnInem = false;
    this.errorsOnInem = false;

    if (numCodu === null) {
      numCodu = null;
    }

    this.msicoWebServices.getCOFetalFichaInemPdf64(numCodu).subscribe(
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

  // Clean the nascimentoViva input from the form
  cleanDataNascimentoViva(): void {
    this.coFetalForm.patchValue({ nascimentoViva: '' });
    this.coFetalForm.patchValue({ horaNascimentoViva: '' });
  }

  // Clean the nascimentoMorta input from the form
  cleanDataNascimentoMorta(): void {
    this.coFetalForm.patchValue({
      nascimentoAnoMorta: ''
    });

    this.coFetalForm.patchValue({
      nascimentoMesMorta: ''
    });

    this.coFetalForm.patchValue({
      nascimentoDiaMorta: ''
    });

    this.coFetalForm.patchValue({ nascimentoMorta: '' });
  }

  // Clean the hora obito input from the form
  cleanHoraObito(): void {
    this.coFetalForm.patchValue({ horaMorte: '' });
  }

  // Clean the apgar inputs from the form
  cleanApgar(): void {
    this.coFetalForm.patchValue({ txt_ho_scoreApgar1: '' });
    this.coFetalForm.patchValue({ txt_ho_scoreApgar5: '' });
    this.coFetalForm.patchValue({ txt_ho_scoreApgar10: '' });
  }

  // Clean the peso input from the form
  cleanPeso(): void {
    this.coFetalForm.patchValue({ peso: '' });
  }

  // Clean the focoFetal input from the form
  cleanFocoFetal(): void {
    this.coFetalForm.patchValue({ focoFetal: '' });
  }

  // Clean the duracaoParto input from the form
  cleanDuracaoParto(): void {
    this.coFetalForm.patchValue({ duracaoParto: '' });
  }

  // Clean the duracaoGravidez input from the form
  cleanSemanasCompletas(): void {
    this.coFetalForm.patchValue({ duracaoGravidez: '' });
    this.coFetalForm.patchValue({ descDuracaoMotivo: '' });
  }

  // Clean the inputs from the form
  cleanCriancaNasceu(): void {
    // this.coFetalForm.patchValue({ nascimentoMorta: '' });
    // this.coFetalForm.patchValue({ nascimentoViva: '' });
    // this.coFetalForm.patchValue({ dataObitoCrianca: '' });
    this.coFetalForm.patchValue({ chkNascDesconhecida: false });
    this.coFetalForm.patchValue({ momentoMorte: '' });
    this.coFetalForm.patchValue({ horaNascimentoViva: '' });
    this.coFetalForm.patchValue({ horaMorte: '' });
    this.coFetalForm.patchValue({ chkHoraObitoDesconhecida: false });
    this.coFetalForm.patchValue({ chkNascMorta: false });
    this.cleanDataNascimentoMorta();
    this.cleanCriancaNasceuViva();
    this.cleanDataObito();
    this.coFetalForm.patchValue({ chkObitoDesconhecida: false });
  }

  // Clean nascimentoViva and horaNascimentoViva inputs from the form
  cleanCriancaNasceuViva(): void {
    // Clean values
    this.coFetalForm.patchValue({
      nascimentoAnoViva: ''
    });

    this.coFetalForm.patchValue({
      nascimentoMesViva: ''
    });

    this.coFetalForm.patchValue({
      nascimentoDiaViva: ''
    });

    // Labels
    this.coFetalForm.patchValue({ nascimentoViva: '' });
    this.coFetalForm.patchValue({ horaNascimentoViva: '' });
  }

  // Clean dataObitoCrianca input from the form
  cleanDataObito(): void {
    if ((this.coFetalForm.controls['chkObitoDesconhecida'].value && this.coFetalForm.get('dataObitoCrianca').value) ||  this.coFetalForm.get('estadoNasc').value) {
      this.coFetalForm.patchValue({
        anoMorte: ''
      });

      this.coFetalForm.patchValue({
        mesMorte: ''
      });

      this.coFetalForm.patchValue({
        diaMorte: ''
      });

      // Method to force call dataObitoHandler for the first time clicking the checkbox
      if (this.dataObitoChkController !== 1) {
        this.dataObitoChkController = 1;
        this.coFetalForm.patchValue({ dataObitoCrianca: '' });
        this.dataObitoHandler();
      } else {
        this.coFetalForm.patchValue({ dataObitoCrianca: '' });
      }
    }
  }

  desconhecidoHandler(e?: any): void {
    if (this.coFetalForm.get('cbSemVigilancia').value) {
      this.coFetalForm.patchValue({ cbVigilDesconhecida: false });
      this.coFetalForm.patchValue({ vigilanciaCheck: false });
    }

    this.coFetalForm.patchValue({ vigilObstPriv: '' });
    this.coFetalForm.patchValue({ vigilVPart: '' });
    this.coFetalForm.patchValue({ vigilCSHospitalares: '' });
    this.coFetalForm.patchValue({ vigilCSPrimarios: '' });
  }

  vigilanciaGravidezHandler(e): void {
    if (this.coFetalForm.get('cbVigilDesconhecida').value) {
      this.coFetalForm.patchValue({ cbSemVigilancia: false });
    }

    this.coFetalForm.patchValue({ vigilObstPriv: '' });
    this.coFetalForm.patchValue({ vigilVPart: '' });
    this.coFetalForm.patchValue({ vigilCSHospitalares: '' });
    this.coFetalForm.patchValue({ vigilCSPrimarios: '' });
  }

  populateResidenciaConcelho(): void {
    // Clean Concelho and Freguesia
    this.coFetalForm.patchValue({ residenciaConcelho: '' });
    this.coFetalForm.patchValue({ residenciaFreguesia: '' });

    // Clean List Residencia
    this.residenciaConcelhoList = this.initialList;
    this.residenciaFreguesiaList = this.initialList;

    // Call the webservice getSpecificFetalListResidenciaConcelhoServices to retrieve the data
    this.msicoWebServices
      .getSpecificFetalListResidenciaConcelhoServices(
        this.coFetalForm.get('anoMorte').value,
        this.coFetalForm.get('mesMorte').value,
        this.coFetalForm.get('diaMorte').value,
        this.dataEmissaoAuxAno,
        this.dataEmissaoAuxMes,
        this.dataEmissaoAuxDia,
        this.coFetalForm.get('residenciaDistrito').value
      )
      .subscribe(
        data => {
          let dataRetrieved: any = data;

          if (dataRetrieved.dadosOutput) {
            this.residenciaConcelhoList =
            dataRetrieved.dadosOutput.residenciaConcelho;
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

  populateResidenciaFreguesia(): void {
    this.coFetalForm.patchValue({ residenciaFreguesia: '' });

    // Call the webservice getSpecificFetalListResidenciaFreguesiaServices to retrieve the data
    this.msicoWebServices
      .getSpecificFetalListResidenciaFreguesiaServices(
        this.coFetalForm.get('anoMorte').value,
        this.coFetalForm.get('mesMorte').value,
        this.coFetalForm.get('diaMorte').value,
        this.dataEmissaoAuxAno,
        this.dataEmissaoAuxMes,
        this.dataEmissaoAuxDia,
        this.coFetalForm.get('residenciaDistrito').value,
        this.coFetalForm.get('residenciaConcelho').value
      )
      .subscribe(
        data => {
          let dataRetrieved: any = data;
          this.residenciaFreguesiaList =
            dataRetrieved.dadosOutput.residenciaFreguesia;
        },
        err => {
          if (err) {
            this.msicoLoading.onLoadingRemove();
            this.msicoAlerts.handlerError(err, this.navCtrl);
          }
        }
      );
  }

  populateLocalObitoConcelho(): void {
    this.coFetalForm.patchValue({ concelhoLocalObito: '' });
    this.coFetalForm.patchValue({ freguesiaLocalObito: '' });

    // Call the webservice getSpecificFetalListLocalObitoConcelhoServices to retrieve the data
    this.msicoWebServices
      .getSpecificFetalListLocalObitoConcelhoServices(
        this.coFetalForm.get('anoMorte').value,
        this.coFetalForm.get('mesMorte').value,
        this.coFetalForm.get('diaMorte').value,
        this.dataEmissaoAuxAno,
        this.dataEmissaoAuxMes,
        this.dataEmissaoAuxDia,
        this.coFetalForm.get('distritoLocalObito').value
      )
      .subscribe(
        data => {
          let dataRetrieved: any = data;

          this.localObitoConcelhoList =
            dataRetrieved.dadosOutput.localObitoConcelho;
        },
        err => {
          if (err) {
            this.msicoLoading.onLoadingRemove();
            this.msicoAlerts.handlerError(err, this.navCtrl);
          }
        }
      );
  }

  populateLocalObitoFreguesia(): void {
    this.coFetalForm.patchValue({ freguesiaLocalObito: '' });

    // Call the webservice getDadosFalecidoCOFetal to retrieve the data
    this.msicoWebServices
      .getSpecificFetalListLocalObitoFreguesiaServices(
        this.coFetalForm.get('anoMorte').value,
        this.coFetalForm.get('mesMorte').value,
        this.coFetalForm.get('diaMorte').value,
        this.dataEmissaoAuxAno,
        this.dataEmissaoAuxMes,
        this.dataEmissaoAuxDia,
        this.coFetalForm.get('distritoLocalObito').value,
        this.coFetalForm.get('concelhoLocalObito').value
      )
      .subscribe(
        data => {
          let dataRetrieved: any = data;
          this.localObitoFreguesiaList =
            dataRetrieved.dadosOutput.localObitoFreguesia;
        },
        err => {
          if (err) {
            this.msicoLoading.onLoadingRemove();
            this.msicoAlerts.handlerError(err, this.navCtrl);
          }
        }
      );
  }

  paisResidenciaSelect(): void {
    if (this.coFetalForm.get('residenciaPais').value !== 'PT') {
      this.blockFieldsResidencia = true;

      // Clean Distrito, Concelho, Freguesia
      this.coFetalForm.patchValue({ residenciaDistrito: '' });
      this.coFetalForm.patchValue({ residenciaConcelho: '' });
      this.coFetalForm.patchValue({ residenciaFreguesia: '' });

      // Clean first Concelho and Freguesia List
      // this.residenciaConcelhoList = [];
      // this.residenciaFreguesiaList = [];

      // Desconhecidos
      this.coFetalForm.patchValue({
        chkDistritoRDesconhecida: this.blockFieldsResidencia
      });
      this.coFetalForm.patchValue({
        chkConcelhoRDesconhecida: this.blockFieldsResidencia
      });
      this.coFetalForm.patchValue({
        chkFreguesiaRDesconhecida: this.blockFieldsResidencia
      });
    } else {
      this.blockFieldsResidencia = false;

      // Desconhecidos
      this.coFetalForm.patchValue({
        chkDistritoRDesconhecida: this.blockFieldsResidencia
      });
      this.coFetalForm.patchValue({
        chkConcelhoRDesconhecida: this.blockFieldsResidencia
      });
      this.coFetalForm.patchValue({
        chkFreguesiaRDesconhecida: this.blockFieldsResidencia
      });
    }
  }

  /**
   * Validates if BI and/or NIC values are empty.
   */
  onValidateBiNicFields({ value }: { value: CertificadoObitoFetal }) {
    if (!this.coFetalForm.get('numBI').value && !this.coFetalForm.get('numUtente').value) {
      this.dynamicConfirmAlertsMessages(this.numBIAndNumUtenteAlertLabel, 'numBI', value);
    } else if (this.coFetalForm.get('numBI').value && !this.coFetalForm.get('numUtente').value) {
      this.dynamicConfirmAlertsMessages(this.numUtenteAlertLabel, 'numUtente', value);
    } else if (!this.coFetalForm.get('numBI').value && this.coFetalForm.get('numUtente').value) {
      this.dynamicConfirmAlertsMessages(this.numBIAlertLabel, 'numBI', value);
    } else {
      this.onSubmitForm({value});
    }
  }

  /**
   * Dynamically shows a pop up with a custom message.
   * If user clicks "Cancelar", he is navigated to the field with the alert. Else, the submit form process is continued.
   * @param dynamicMessage Message to be shown in the pop up alert
   * @param elementName Name of the element with the error
   * @param value coNormalForm
   */
  async dynamicConfirmAlertsMessages(dynamicMessage: any, elementName: string, value: CertificadoObitoFetal) {
    let element: any;
    let alert = await this.alertCtrl.create({
      header: 'Atenção',
      subHeader: dynamicMessage,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            element = document.getElementsByName(elementName)[0];
            // If the element is not null then add the class
            if (element !== undefined) {
              element.classList.add('alertValidationItem');

              // Open "Identificação do Falecido" Section
              this.identFale = true;

              // Navigate to field
              this.scrollToTop();
            }
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.onSubmitForm({value});
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  // Submit the data from the form to validation
  onSubmitForm({ value }: { value: CertificadoObitoFetal }): void {
    // Create loading
    this.msicoLoading.onLoading();

    let listVerify: any;

    // Clean Alert and Errors List from SNS and BI
    this.listErrorsBICValidation = null;
    this.listAlertsBICValidation = null;

    this.listAlertsBISNSValidation = null;
    this.listErrorsBISNSValidation = null;

    this.showCheckIconBIC = false;
    this.showCheckMarkIcon = false;

    this.showCloseIcon = false;
    this.showCloseIconBIC = false;

    /*Delete the nascimentoViva,dataObitoCrianca and nascimentoMorta fields from the Object,
      because the server will not accept with the values that contains*/
    delete value.nascimentoViva;
    delete value.dataObitoCrianca;
    delete value.nascimentoMorta;

    // Default values on submit
    value.dataEmissao = this.initialData.dataEmissao;
    value.horaEmissao = this.initialData.horaEmissao;
    value.nomeClinico = this.initialData.nomeClinico;
    value.numCedulaProfissional = this.initialData.numCedulaProfissional;
    value.codigoInmlProfissional = this.initialData.codigoInmlProfissional;

    // Tipo Parto
    value.tipoParto = this.coFetalForm.get('tipoParto').value;

    /*If the dataNascimentoMae is not null then split the value
    into and create an string with the three values to submit*/
    if (this.coFetalForm.get('dataNascimentoMae').value) {
      let dataNascimentoMaeSplited = this.coFetalForm
        .get('dataNascimentoMae')
        .value.split('-');

      value.dataNascimentoMae =
        dataNascimentoMaeSplited[2] +
        '-' +
        dataNascimentoMaeSplited[1] +
        '-' +
        dataNascimentoMaeSplited[0];
    }

    /*If the dataParto is not null then split the value
    into and create an string with the three values to submit*/
    if (this.coFetalForm.get('dataParto').value) {
      let dataPartoSplited = this.coFetalForm.get('dataParto').value.split('-');
      value.dataParto =
        dataPartoSplited[2] +
        '-' +
        dataPartoSplited[1] +
        '-' +
        dataPartoSplited[0];
    }

    /*If the dataPartoAnterior is not null then split the value
    into and create an string with the three values to submit*/
    if (this.coFetalForm.get('dataPartoAnterior').value) {
      let dataPartoAnteriorSplited = this.coFetalForm
        .get('dataPartoAnterior')
        .value.split('-');
      value.dataPartoAnterior =
        dataPartoAnteriorSplited[2] +
        '-' +
        dataPartoAnteriorSplited[1] +
        '-' +
        dataPartoAnteriorSplited[0];
    }

    /*If the dataAutopsia is not null then split the value
    into and create an string with the three values to submit*/

    if (this.coFetalForm.get('dataAutopsia').value) {
      let dataAutopsiaSplited = this.coFetalForm
        .get('dataAutopsia')
        .value.split('-');

      value.dataAutopsia =
        dataAutopsiaSplited[2] +
        '-' +
        dataAutopsiaSplited[1] +
        '-' +
        dataAutopsiaSplited[0];
    }

    // Morte
    value.anoMorte = this.coFetalForm.get('anoMorte').value;
    value.mesMorte = this.coFetalForm.get('mesMorte').value;
    value.diaMorte = this.coFetalForm.get('diaMorte').value;

    value.baseCausaMorte = this.coFetalForm.get('baseCausaMorte').value;
    value.idHospitaisObito = this.coFetalForm.get('idHospitaisObito').value;
    value.idUACObito = this.coFetalForm.get('idUACObito').value;
    value.idOutroObito = this.coFetalForm.get('idOutroObito').value;
    value.tipoObitoSelected = this.coFetalForm.get('tipoObitoSelected').value;
    value.idMoradaProfissionalServicoObito = this.coFetalForm.get(
      'idMoradaProfissionalServicoObito'
    ).value;
    value.paisLocalObito = this.coFetalForm.get('paisLocalObito').value;
    value.idHospitalParto = this.coFetalForm.get('idHospitalParto').value;
    value.codigoInmlProfissional = this.coFetalForm.get(
      'codigoInmlProfissional'
    ).value;
    value.codigoSaudeProfissional = this.coFetalForm.get(
      'codigoSaudeProfissional'
    ).value;
    value.idMoradaProfissionalServicoObito = this.coFetalForm.get(
      'idMoradaProfissionalServicoObito'
    ).value;
    value.descMoradaProfissionalServicoOutro = this.coFetalForm.get(
      'descMoradaProfissionalServicoOutro'
    ).value;

    /*If the nascimentoMorta is not null then,split the value into three different values
    *the server is expecting three different values which is year, month an day separately*/
    if (this.coFetalForm.get('nascimentoMorta').value) {
      value.nascimentoAnoMorta = this.coFetalForm.get(
        'nascimentoAnoMorta'
      ).value;
      value.nascimentoMesMorta = this.coFetalForm.get(
        'nascimentoMesMorta'
      ).value;
      value.nascimentoDiaMorta = this.coFetalForm.get(
        'nascimentoDiaMorta'
      ).value;
    }

    /*If the nascimentoViva is not null then,split the value into three different values
    *the server is expecting three different values which is year, month an day separately*/

    if (this.coFetalForm.get('nascimentoViva').value) {
      value.nascimentoAnoViva = this.coFetalForm.get('nascimentoAnoViva').value;
      value.nascimentoMesViva = this.coFetalForm.get('nascimentoMesViva').value;
      value.nascimentoDiaViva = this.coFetalForm.get('nascimentoDiaViva').value;
    }

    this.formParsed = value;

    // Prevent
    event.preventDefault();

    // If the numBI is not null then remove leading zeros
    if (this.coFetalForm.get('numBI').value) {
      value.numBI = value.numBI.replace(/^0+/, '');
      this.coFetalForm.patchValue({ numBI: value.numBI });
    }

    // Call the webservices to validation
    this.msicoWebServices.verifyCOFetal(value, 'altera').subscribe(
      data => {
        listVerify = data;
        let element: any;

        if (this.coFetalForm.get('coVersaoAnteriorComNuipc').value === false) {
          if (this.coFetalForm.get('bicComNuipc').value === true) {
            this.controlFieldsDispensaAndNuipc = true;
          } else {
            this.controlFieldsDispensaAndNuipc = false;
          }
        }

        // While there is elements with class 'errorValidationItem' clear out
        while (this.elementsErrors.length) {
          this.elementsErrors[0].className = this.elementsErrors[0].className.replace(
            /\berrorValidationItem\b/g,
            ''
          );
        }
        // While there is elements with class 'balertValidationItem' clear out
        while (this.elementsAlerts.length) {
          this.elementsAlerts[0].className = this.elementsAlerts[0].className.replace(
            /\balertValidationItem\b/g,
            ''
          );
        }

        // If the result is 2 then
        if (listVerify.resultadoOutput === '2') {
          this.errorsOnValidation = true;

          this.alertsOnValidation = false;
          this.showSubmitMessage = false;

          this.identFale = true;
          this.obito = true;
          this.causaMorte = true;
          this.dadosRelativos = true;
          this.dadosRelativosMae = true;
          this.medico = true;
          this.ministerioPublico = true;

          // List of errors to be displayed
          this.listErrorsValidation = listVerify.dadosOutput.listaErrosComCampo;

          // Create errors borders on the inputs that have an error message associated
          for (let listerrors of this.listErrorsValidation) {
            for (let errorsfield of listerrors.camposErro) {
              element = document.getElementsByName(errorsfield)[0];
              // If the element is not null then add the class
              if (element !== undefined) {
                element.classList.add('errorValidationItem');
              }
            }
          }
        } else if (listVerify.resultadoOutput === '0') {
          // If the result is 0 then sucess on the submission
          this.errorsOnValidation = false;
          this.alertsOnValidation = false;
          this.showSubmitMessage = true;
          this.controlDisable = true;
          this.controlFieldsFromNUIPC = true;
          this.controlFieldsDispensaAndNuipc = true;
        } else if (listVerify.resultadoOutput === '1') {
          // If the result is 1 then there is some alerts
          this.errorsOnValidation = false;
          this.showSubmitMessage = true;
          this.alertsOnValidation = true;
          this.controlDisable = true;
          this.controlFieldsFromNUIPC = true;
          this.controlFieldsDispensaAndNuipc = true;

          // Open Sections
          this.identFale = true;
          this.obito = true;
          this.causaMorte = true;
          this.dadosRelativos = true;
          this.dadosRelativosMae = true;
          this.medico = true;
          this.ministerioPublico = true;

          // List of alerts to be displayed
          this.listAlertsValidation =
            listVerify.dadosOutput.listaAlertasComCampo;

          // Create alert borders on the inputs that have an alert message associated
          for (let listalerts of this.listAlertsValidation) {
            for (let alertsfield of listalerts.camposAlerta) {
              element = document.getElementsByName(alertsfield)[0];

              // If the element is not null then add the class
              if (element !== undefined) {
                element.classList.add('alertValidationItem');
              }
            }
          }
        }
        // Dismiss
        this.msicoLoading.onLoadingRemove();

        // Scroll to the top
        //this.content.scrollToTop();
      },
      err => {
        if (err) {
          this.msicoLoading.onLoadingRemove();
          this.msicoAlerts.handlerError(err, this.navCtrl);
        }
      }
    );
  }

  getDadosFalecidoCOFetalHandler(): void {
    this.msicoLoading.onLoadingRemove();

    // Create Loading
    this.msicoLoading.onLoading();

    // Call the webservice getDataBicCONormal to retrieve the data
    this.msicoWebServices
      .getDadosFalecidoCOFetal(
        this.coFetalForm.get('numUtente').value,
        this.coFetalForm.get('numBI').value
      )
      .subscribe(
        data => {
          let dataRetrieved: any = data;

          this.coFetalForm.patchValue({ nome: dataRetrieved.dadosOutput.nome });
          this.coFetalForm.patchValue({
            nomePai: dataRetrieved.dadosOutput.nomePai
          });
          this.coFetalForm.patchValue({
            nomeMae: dataRetrieved.dadosOutput.nomeMae
          });
          this.coFetalForm.patchValue({
            numBI: dataRetrieved.dadosOutput.numBI
          });
          this.coFetalForm.patchValue({
            numUtente: dataRetrieved.dadosOutput.numUtente
          });
          this.coFetalForm.patchValue({ sexo: dataRetrieved.dadosOutput.sexo });

          if (dataRetrieved.resultadoOutput === '0') {
            this.msicoLoading.onLoadingRemove();
            this.showCheckMarkIcon = true;
            this.showCloseIcon = false;
            this.listAlertsBISNSValidation = null;
            this.listErrorsBISNSValidation = null;

            // Errors
          } else if (dataRetrieved.resultadoOutput === '2') {
            this.msicoLoading.onLoadingRemove();
            this.listErrorsBISNSValidation =
              dataRetrieved.dadosOutput.listaErrosComCampo;
            this.listAlertsBISNSValidation = null;
            this.showCheckMarkIcon = false;
            this.showCloseIcon = true;

            this.paintErrors(this.listErrorsBISNSValidation);

            // Alerts
          } else if (dataRetrieved.resultadoOutput === '1') {
            this.msicoLoading.onLoadingRemove();
            this.showCloseIcon = true;
            this.showCheckMarkIcon = false;
            this.listAlertsBISNSValidation =
              dataRetrieved.dadosOutput.listaAlertasComCampo;
            this.listErrorsBISNSValidation = null;

            this.paintAlerts(this.listAlertsBISNSValidation);
          } else {
            this.msicoLoading.onLoadingRemove();
            this.listAlertsBISNSValidation =
              dataRetrieved.dadosOutput.listaAlertasComCampo;
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

  // After validition, on the final submission
  onSubmitData(): void {
    this.msicoLoading.onLoading();

    let element: any;

    // Call the webservice submitSucessCOFetal to send the final data to the server
    this.msicoWebServices
      .submitSucessCOFetal(this.formParsed, 'altera')
      .subscribe(
        data => {
          let dataRetrieved: any = data;

          // If the result is 2 then
          if (dataRetrieved.resultadoOutput === '2') {
            this.errorsOnValidation = true;
            this.alertsOnValidation = false;
            this.showSubmitMessage = false;
            this.showSucessMessage = false;
            this.controlDisable = false;

            // Loading Remove
            this.msicoLoading.onLoadingRemove();

            // Scroll to Top
            //this.content.scrollToTop();

            // List of errors to be displayed
            this.listErrorsValidation =
              dataRetrieved.dadosOutput.listaErrosComCampo;

            // Create errors borders on the inputs that have an error message associated
            for (let listerrors of this.listErrorsValidation) {
              for (let errorsfield of listerrors.camposErro) {
                element = document.getElementsByName(errorsfield)[0];
                // If the element is not null then add the class
                if (element !== undefined) {
                  element.classList.add('errorValidationItem');
                }
              }
            }
          } else if (dataRetrieved.resultadoOutput === '0') {
            // If the result is 0 then sucess on the submission
            this.errorsOnValidation = false;
            this.alertsOnValidation = false;
            this.showSubmitMessage = true;
            this.controlDisable = true;

            // Loading Remove
            this.msicoLoading.onLoadingRemove();

            // ID CO
            this.idCOFetal = dataRetrieved.dadosOutput.idCOFetal;

            this.formParsed.numCertificado =
              dataRetrieved.dadosOutput.numCertificado;

            this.numCOFetalForSucess = dataRetrieved.dadosOutput.numCertificado;

            this.coFetalForm.patchValue({
              numCertificado: dataRetrieved.dadosOutput.numCertificado
            });

            this.numCOFetalForSucess = dataRetrieved.dadosOutput.numCertificado;

            this.navCtrl.navigateForward('sucessoCOFetal', {
              state: {
                idCOFetal: this.idCOFetal,
                numCOFetalForSucess: this.numCOFetalForSucess,
                msgConfirmacao: dataRetrieved.dadosOutput.msgConfirmacao,
                operation: 'complementar'
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

  // By pressing the cancel button during the validation process
  onCancel(): void {
    this.alertsOnValidation = false;
    this.showSubmitMessage = false;
    this.controlDisable = false;
    //this.content.scrollToTop();

    if (this.coFetalForm.get('coVersaoAnteriorComNuipc').value === false) {
      if (this.coFetalForm.get('bicComNuipc').value) {
        this.controlFieldsDispensaAndNuipc = true;
      } else {
        this.controlFieldsDispensaAndNuipc = false;
      }
    }
  }

  // An content pane that display different domain lists on a full page mode
  async listModal(list: any, typeofList: any, description: string) {
    if (!this.controlDisable) {
      let modal = await this.modalCtrl.create({
        component: ListModalComponent
        //l: list,
        //desc: description
      });
      await modal.present();

      const { data, role } = await modal.onWillDismiss();
      if (data) {
        this.parseData(data, typeofList);
      }
    }
  }

  // Parse Data - auxiliary function for listModal function
  parseData(data: any, typeofList: any): void {
    if (typeofList === 'causaMorte') {
      this.causaMorteLabel = data.labelData;
      this.coFetalForm.patchValue({ baseCausaMorte: data.DataData });

      if (this.coFetalForm.get('baseCausaMorte').value === '1' ||
          this.coFetalForm.get('baseCausaMorte').value === '4' ||
          this.coFetalForm.get('baseCausaMorte').value === '5' ||
          this.coFetalForm.get('baseCausaMorte').value === '6'
          ) {
        this.coFetalForm.patchValue({ dataAutopsia: '' });
        this.coFetalForm.patchValue({ horaAutopsia: '' });
        this.coFetalForm.patchValue({ numProcessoAutopsia: '' });
      }
      if (this.coFetalForm.get('baseCausaMorte').value === '2' ||
          this.coFetalForm.get('baseCausaMorte').value === '3'
          ) {
        this.camposAutopsiaFieldBlock();
      }
    } else if (typeofList === 'instSaudeParto') {
      this.instSaudePartoLabel = data.labelData;
      this.coFetalForm.patchValue({ idHospitalParto: data.DataData });
    } else if (typeofList === 'instSaudeObito') {
      this.instituicaoSaudeObitoLabel = data.labelData;
      this.instSaudeObitoHandler(data.DataData);
    } else if (typeofList === 'partoFoi') {
      this.coFetalForm.patchValue({ outroTipoParto: '' });
      this.coFetalForm.patchValue({ tipoParto: data.DataData });
      this.partoFoiLabel = data.labelData;
    } else if (typeofList === 'instituicaoSaudeMoradaPro') {
      this.instituicaoSaudeMoradaProfissionalLabel = data.labelData;
      this.coFetalForm.patchValue({ codigoSaudeProfissional: data.DataData });
    } else if (typeofList === 'instituicaoMoradaPro') {
      this.instituicaoMoradaProfissionalLabel = data.labelData;
      this.coFetalForm.patchValue({ codigoInmlProfissional: data.DataData });
    } else if (typeofList === 'tipoObito') {
      // Tipo Obito which has the label to be represent on the form and the data to be sent to the server
      this.tipoObitoLabel = data.labelData;
      this.coFetalForm.patchValue({ tipoObitoSelected: data.DataData });
      this.coFetalForm.patchValue({ descOutroAcidente: '' });
      this.onSelectTipoObito();
    } else if (typeofList === 'idMoradaProfissionalServicoObito') {
      /*idMoradaProfissionalServicoObito which has the label to be represent
      on the form and the data to be sent to the server*/
      this.servicoLabel = data.labelData;
      this.coFetalForm.patchValue({
        idMoradaProfissionalServicoObito: data.DataData
      });

      if (this.coFetalForm.get('idMoradaProfissionalServicoObito').value !== '4') {
        this.coFetalForm.patchValue({ descMoradaProfissionalServicoOutro: '' });
      }
    }
  }

  // Select Tipo de Obito, if is 11 then block the Causas Morte fields
  onSelectTipoObito(): void {
    if (this.coFetalForm.controls['tipoObitoSelected'].value === '11') {
      this.blockCausaMorte = true;

      this.coFetalForm.patchValue({ outroCmA: '' });
      this.coFetalForm.patchValue({ tempoA: '' });
      this.coFetalForm.patchValue({ unidTempoA: '' });
      this.coFetalForm.patchValue({ outroCmB: '' });
      this.coFetalForm.patchValue({ tempoB: '' });
      this.coFetalForm.patchValue({ unidTempoB: '' });
      this.coFetalForm.patchValue({ outroCmC: '' });
      this.coFetalForm.patchValue({ tempoC: '' });
      this.coFetalForm.patchValue({ unidTempoC: '' });
      this.coFetalForm.patchValue({ outroCmD: '' });
      this.coFetalForm.patchValue({ tempoD: '' });
      this.coFetalForm.patchValue({ unidTempoD: '' });
      this.coFetalForm.patchValue({ outroCmE: '' });
      this.coFetalForm.patchValue({ tempoE: '' });
      this.coFetalForm.patchValue({ unidTempoE: '' });
    } else {
      this.blockCausaMorte = false;
    }
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

  // Avoid space input control
  avoidSpaceInput(num: string, tempo: any, event: any, numChar: number) {
    if (event) {
      if (event.value.match(/\s/, '')) {
        event.value = event.value.replace(/\s/, '');
      }

      if (num.length > numChar) {
        let obj = this.coFetalForm.get(tempo).value;

        obj = obj.substring(0, num.length - 1);
        this.coFetalForm.controls[tempo].setValue(obj);
      }
    }
  }

  populateInstSaudeList(): void {
    this.instituicaoSaudeObitoLabel = '<Escolher>';
    this.coFetalForm.patchValue({ idHospitaisObito: '' });
    this.coFetalForm.patchValue({ idUACObito: '' });
    this.coFetalForm.patchValue({ idOutroObito: '' });
    this.coFetalForm.patchValue({ idServicoObito: '' });
    this.coFetalForm.patchValue({ descServicoObitoOutro: '' });

    this.listHospistais = [];
    this.listHospistais = [
      this.list.listHospitais,
      this.list.listUAC,
      this.list.listOutrosMed
    ];

    let selectEntidadeObito: number = this.coFetalForm.get(
      'selectEntidadeObito'
    ).value;

    this.instSaudeList = this.listHospistais[selectEntidadeObito - 1];
  }

  populateInstSaudePartoList(): void {
    this.instSaudePartoLabel = '<Escolher>';
    this.coFetalForm.patchValue({ idHospitalParto: '' });

    this.listHospistaisParto = [];
    this.listHospistaisParto = [
      this.list.listHospitaisMed,
      this.list.listUACMed,
      this.list.listOutrosMed
    ];

    let tipoEntidadeParto: number = this.coFetalForm.get('tipoEntidadeParto')
      .value;

    this.LocalObitoPartoList = this.listHospistaisParto[tipoEntidadeParto - 1];
  }

  populateInstSaudeMoradaProfList(): void {
    // Clear data before
    this.coFetalForm.patchValue({ idMoradaProfissionalServicoObito: '' });
    this.servicoLabel = '<Escolher>';
    this.coFetalForm.patchValue({ descMoradaProfissionalServicoOutro: '' });

    // Instituição which has the label to be represent on the form and the data to be sent to the server
    this.instituicaoSaudeMoradaProfissionalLabel = '<Escolher>';

    // Instituição de saúde which has the label to be represent on the form and the data to be sent to the server
    this.coFetalForm.patchValue({ codigoInmlProfissional: '' });
    this.coFetalForm.patchValue({ codigoSaudeProfissional: '' });

    this.listHospitaisMoradaProf = [];
    this.listHospitaisMoradaProf = [
      this.list.listHospitaisMed,
      this.list.listUACMed,
      this.list.listOutrosMed
    ];

    let selectEntidade: number = this.coFetalForm.get('selectEntidade').value;

    this.instSaudeMoradaProfList = this.listHospitaisMoradaProf[
      selectEntidade - 1
    ];
  }

  // It handles the diferent hospitals list from the data parameter
  instSaudeObitoHandler(data): void {
    if (this.coFetalForm.get('selectEntidadeObito').value === '1') {
      this.coFetalForm.patchValue({ idHospitaisObito: data });
    } else if (this.coFetalForm.get('selectEntidadeObito').value === '2') {
      this.coFetalForm.patchValue({ idUACObito: data });
    } else if (this.coFetalForm.get('selectEntidadeObito').value === '3') {
      this.coFetalForm.patchValue({ idOutroObito: data });
    }
  }

  countrySelection(): void {
    if (this.coFetalForm.get('paisLocalObito').value !== 'PT') {
      this.coFetalForm.patchValue({ distritoLocalObito: '' });
      this.coFetalForm.patchValue({ concelhoLocalObito: '' });
      this.coFetalForm.patchValue({ freguesiaLocalObito: '' });
      this.blockValuesFromCountry = true;
    } else if (this.coFetalForm.get('paisLocalObito').value === 'PT') {
      this.blockValuesFromCountry = false;
    }
  }

  async localObitoInfoAlert() {
    if (!this.alertLocalObitoInfoAux) {
      this.alertLocalObitoInfoAux = true;
      let alert = await this.alertCtrl.create({
        header: 'Info - ' + 'Local do Óbito',
        subHeader: this.localObitoInfoLabel,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  // Clean motivoInumCrem input from the form
  cleanMotivo(): void {
    this.coFetalForm.patchValue({ motivoInumCrem: '' });
  }

  // Clean residenciaMorada input from the form
  cleanMorada(): void {
    this.coFetalForm.patchValue({ residenciaMorada: '' });
  }

  // Clean inputs from the form
  cleanResidenciaHabitual(value): void {
    // Clean the inputs if the option is Pais
    if (value === 'Pais') {
      this.desconhecidoPais = !this.desconhecidoPais;
      this.coFetalForm.patchValue({ paisResidencia: null });

      if (this.coFetalForm.get('chkPaisRDesconhecida').value) {
        this.coFetalForm.patchValue({ residenciaPais: '' });
        this.coFetalForm.patchValue({ residenciaDistrito: '' });
        this.coFetalForm.patchValue({ residenciaConcelho: '' });
        this.coFetalForm.patchValue({ residenciaFreguesia: '' });
      } else {
        this.coFetalForm.patchValue({ residenciaPais: 'PT' });
      }

      this.coFetalForm.patchValue({
        chkConcelhoRDesconhecida: this.coFetalForm.get('chkPaisRDesconhecida').value
      });
      this.coFetalForm.patchValue({
        chkDistritoRDesconhecida: this.coFetalForm.get('chkPaisRDesconhecida').value
      });
      this.coFetalForm.patchValue({
        chkFreguesiaRDesconhecida: this.coFetalForm.get('chkPaisRDesconhecida').value
      });
    } else if (value === 'Distrito') {
      // Clean the inputs if the option is Distrito
      this.desconhecidoDistrito = !this.desconhecidoDistrito;

      this.coFetalForm.patchValue({ residenciaDistrito: '' });
      this.coFetalForm.patchValue({ residenciaConcelho: '' });
      this.coFetalForm.patchValue({ residenciaFreguesia: '' });

      this.coFetalForm.patchValue({
        chkConcelhoRDesconhecida: this.desconhecidoDistrito
      });
      this.coFetalForm.patchValue({
        chkFreguesiaRDesconhecida: this.desconhecidoDistrito
      });
    } else if (value === 'Concelho') {
      // Clean the inputs if the option is Concelho
      this.desconhecidoConcelho = !this.desconhecidoConcelho;

      this.coFetalForm.patchValue({ residenciaConcelho: '' });
      this.coFetalForm.patchValue({ residenciaFreguesia: '' });

      this.coFetalForm.patchValue({
        chkFreguesiaRDesconhecida: this.desconhecidoConcelho
      });
    } else if (value === 'Freguesia') {
      // Clean the inputs if the option is Freguesia
      this.coFetalForm.patchValue({ residenciaFreguesia: '' });
    }
  }

  // Clean the inputs from the form
  cleanLocal(): void {
    this.coFetalForm.patchValue({ tipoEntidadeParto: null });
    this.instSaudePartoLabel = '<Escolher>';
    this.coFetalForm.patchValue({ idHospitalParto: '' });
    this.coFetalForm.patchValue({ descLocalParto: '' });
  }

  // Clean the inputs from the form
  cleanValuesLocalObito(): void {
    this.coFetalForm.patchValue({ selectEntidadeObito: null });
    this.instituicaoSaudeObitoLabel = '<Escolher>';
    this.coFetalForm.patchValue({ idHospitaisObito: '' });
    this.coFetalForm.patchValue({ idUACObito: '' });
    this.coFetalForm.patchValue({ idOutroObito: '' });
    this.coFetalForm.patchValue({ idServicoObito: '' });
    this.coFetalForm.patchValue({ descLocalObito: '' });
    this.coFetalForm.patchValue({ descServicoObitoOutro: '' });
    this.coFetalForm.patchValue({ descOutroAcidente: '' });
    this.coFetalForm.patchValue({ paisLocalObito: 'PT' });

    this.coFetalForm.patchValue({ distritoLocalObito: '' });
    this.coFetalForm.patchValue({ concelhoLocalObito: '' });
    this.coFetalForm.patchValue({ freguesiaLocalObito: '' });
  }

  // Clean the inputs from the form based on the option selected
  cleanMoradaProfissional(): void {
    this.coFetalForm.patchValue({ selectEntidade: '' });
    this.coFetalForm.patchValue({
      instituicaoSaudeMoradaProfissionalLabel: '<Escolher>'
    });
    this.coFetalForm.patchValue({ codigoSaudeProfissional: '' });
    this.coFetalForm.patchValue({ idMoradaProfissionalServicoObito: '' });
    this.servicoLabel = '<Escolher>';

    // Morada Profissional
    this.coFetalForm.patchValue({ moradaClinico: '' });
    this.coFetalForm.patchValue({ codigoInmlProfissional: '' });
    this.instituicaoMoradaProfissionalLabel = '<Escolher>';
  }

  // Clean the input from the form
  cleanDescServicoObitoOutro(): void {
    if (this.coFetalForm.get('idServicoObito').value !== '4') {
      this.coFetalForm.patchValue({ descServicoObitoOutro: '' });
    }
  }

  // Clean the input from the form
  cleanValuesClassificacaoMorte(): void {
    this.coFetalForm.patchValue({ classificacaoMorteMalf: '' });
  }

  // Clean the input from the form
  cleanValuesNaturezaParto(): void {
    this.coFetalForm.patchValue({ numGemeos: '' });
    this.coFetalForm.patchValue({ numNadosVivos: '' });
    this.coFetalForm.patchValue({ numFetosMortos: '' });
  }

  // Clean checked values from the form
  cleanValuesPatologias(): void {
    this.coFetalForm.patchValue({ cbPatHipArt: null });
    this.coFetalForm.patchValue({ cbPatDiaGes: null });
    this.coFetalForm.patchValue({ cbPatDiaMel1: null });
    this.coFetalForm.patchValue({ cbPatDiaMel2: null });
    this.coFetalForm.patchValue({ cbPatDoeMental: null });
    this.coFetalForm.patchValue({ cbPatDoeNeuro: null });
    this.coFetalForm.patchValue({ cbPatInfTransSex: null });
    this.coFetalForm.patchValue({ cbPatObesidade: null });
    this.coFetalForm.patchValue({ cbPatOutra: null });
  }

  // Clean the input from the form
  cleanValuesPatOutraDesc(): void {
    if (this.coFetalForm.get('cbPatOutra').value) {
      this.coFetalForm.patchValue({ patOutraDesc: '' });
    }
  }

  pad(n, width, z): void {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  // Get data from the server based on the number of BIC
  getDataBICHandler(): void {
    this.msicoLoading.onLoadingRemove();
    // Create loading
    this.msicoLoading.onLoading();

    // Call the webservice getDadosBicCOFetal to retrieve the data
    this.msicoWebServices
      .getDadosBicCOFetal(
        this.coFetalForm.get('numBIC').value,
        'altera',
        this.coFetalForm.get('idCOFetal').value,
        this.coFetalForm.get('numCertificado').value
      )
      .subscribe(
        data => {
          let dataRetrieved: any = data;

          if (
            this.coFetalForm.get('coVersaoAnteriorComNuipc').value === false
          ) {
            // If the old bicComNuipc is true
            if (this.coFetalForm.get('bicComNuipc').value === true) {
              // If bicComNuipc is true from server
              if (dataRetrieved.dadosOutput.bicComNuipc === true) {
                this.coFetalForm.patchValue({
                  dispensaAutopsia: dataRetrieved.dadosOutput.dispensaAutopsia
                });

                this.coFetalForm.patchValue({
                  nuipc: dataRetrieved.dadosOutput.nuipc
                });

                this.controlFieldsFromNUIPC = true;
                this.controlFieldsDispensaAndNuipc = true;
              } else {
                // If bicComNuipc is false from server
                this.coFetalForm.patchValue({
                  dispensaAutopsia: ''
                });

                this.coFetalForm.patchValue({
                  nuipc: ''
                });

                this.controlFieldsFromNUIPC = false;
                this.controlFieldsDispensaAndNuipc = false;
              }
              // If the old bicComNuipc is false
            } else {
              // If bicComNuipc is true from server
              if (dataRetrieved.dadosOutput.bicComNuipc) {
                this.coFetalForm.patchValue({
                  dispensaAutopsia: dataRetrieved.dadosOutput.dispensaAutopsia
                });

                this.coFetalForm.patchValue({
                  nuipc: dataRetrieved.dadosOutput.nuipc
                });

                this.controlFieldsFromNUIPC = true;
                this.controlFieldsDispensaAndNuipc = true;
              }
            }
          } else {
            if (dataRetrieved.dadosOutput.dispensaAutopsia !== null) {
              this.coFetalForm.patchValue({
                dispensaAutopsia: dataRetrieved.dadosOutput.dispensaAutopsia
              });
            }

            if (dataRetrieved.dadosOutput.nuipc !== null) {
              this.coFetalForm.patchValue({
                nuipc: dataRetrieved.dadosOutput.nuipc
              });
            }
          }

          this.coFetalForm.patchValue({
            bicComNuipc: dataRetrieved.dadosOutput.bicComNuipc
          });

          // Insert automatically values from the server to the form
          if (dataRetrieved.dadosOutput.nome) {
            this.coFetalForm.patchValue({
              nome: dataRetrieved.dadosOutput.nome
            });
          }
          if (dataRetrieved.dadosOutput.nomePai) {
            this.coFetalForm.patchValue({
              nomePai: dataRetrieved.dadosOutput.nomePai
            });
          }
          if (dataRetrieved.dadosOutput.nomeMae) {
            this.coFetalForm.patchValue({
              nomeMae: dataRetrieved.dadosOutput.nomeMae
            });
          }
          if (dataRetrieved.dadosOutput.numBI) {
            this.coFetalForm.patchValue({
              numBI: dataRetrieved.dadosOutput.numBI
            });
          }
          if (dataRetrieved.dadosOutput.numUtente) {
            this.coFetalForm.patchValue({
              numUtente: dataRetrieved.dadosOutput.numUtente
            });
          }
          if (dataRetrieved.dadosOutput.sexo) {
            this.coFetalForm.patchValue({
              sexo: dataRetrieved.dadosOutput.sexo
            });
          }

/*           if (dataRetrieved.dadosOutput.nuipc) {
            this.coFetalForm.patchValue({
              nuipc: dataRetrieved.dadosOutput.nuipc
            });

            this.coFetalForm.patchValue({
              dispensaAutopsia: dataRetrieved.dadosOutput.dispensaAutopsia
            });

            this.controlFieldsFromNUIPC = true;
          } else {
            this.controlFieldsFromNUIPC = false;
          } */

          // If the results are 0 or 1 then
          if (dataRetrieved.resultadoOutput === '0') {
            this.msicoLoading.onLoadingRemove();

            this.listErrorsBICValidation = null;
            this.listAlertsBICValidation = null;

            this.showCheckIconBIC = true;
            this.showCloseIconBIC = false;

            // Alerts
          } else if (dataRetrieved.resultadoOutput === '1') {
            this.msicoLoading.onLoadingRemove();
            this.showCloseIconBIC = false;
            this.showCheckIconBIC = true;
            this.listAlertsBICValidation =
              dataRetrieved.dadosOutput.listaAlertasComCampo;

            this.listErrorsBICValidation = null;

            this.paintAlerts(this.listAlertsBICValidation);

            // Open Sections
            this.identFale = true;
            this.obito = true;
            this.causaMorte = true;
            this.dadosRelativos = true;
            this.dadosRelativosMae = true;
            this.medico = true;
            this.ministerioPublico = true;

            // Errors
          } else if (dataRetrieved.resultadoOutput === '2') {
            this.msicoLoading.onLoadingRemove();
            this.showCloseIconBIC = true;
            this.showCheckIconBIC = false;
            this.listErrorsBICValidation =
              dataRetrieved.dadosOutput.listaErrosComCampo;

            this.listAlertsBICValidation = null;

            this.paintErrors(this.listErrorsBICValidation);

            // Open Sections
            this.identFale = true;
            this.obito = true;
            this.causaMorte = true;
            this.dadosRelativos = true;
            this.dadosRelativosMae = true;
            this.medico = true;
            this.ministerioPublico = true;
          } else {
            this.msicoLoading.onLoadingRemove();
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

  cleanDataFromBIC() {
    // Insert automatically values from the server to the form
    this.coFetalForm.patchValue({
      nome: ''
    });

    this.coFetalForm.patchValue({
      nomePai: ''
    });

    this.coFetalForm.patchValue({
      nomeMae: ''
    });

    this.coFetalForm.patchValue({
      numBI: ''
    });

    this.coFetalForm.patchValue({
      numUtente: ''
    });

    this.coFetalForm.patchValue({
      sexo: ''
    });

    this.coFetalForm.patchValue({
      nuipc: ''
    });

    this.coFetalForm.patchValue({
      dispensaAutopsia: ''
    });
  }

  dateChangeFormat(value) {
    let list: string[];
    list = value.split('-');
    return list;
  }

  cleanDataFromUtenteOrNIC() {
    this.coFetalForm.patchValue({ nome: '' });
    this.coFetalForm.patchValue({
      nomePai: ''
    });
    this.coFetalForm.patchValue({
      nomeMae: ''
    });
    this.coFetalForm.patchValue({
      numBI: ''
    });
    this.coFetalForm.patchValue({
      numUtente: ''
    });
    this.coFetalForm.patchValue({ sexo: '' });
  }

  /**
   * Create an alert when the user chooses the "Suspeito" option in 'Paciente Infetado por SARS-CoV-2' field for the first time.
   * @param event Value of the chosen option
   */
  alertResCovid19Suspeito(event: any) {
    if (event && !this.alertResCovid19SuspeitoAux) {
      this.alertResCovid19SuspeitoAux = true;
      this.msicoAlerts.dynamicAlertsMessages(`
        <p>A opção Suspeito só deve de ser selecionada quando se verifica uma das duas situações:</p>
        <p>1. Quando ainda estão a aguardar os resultados dos testes;</p>
        <p>2. Quando há suspeita que a causa de morte é COVID-19 e não foi possível a realização de testes.</p>
      `);
    }
  }

  paintAlerts(list: any) {
    let element: any;

    // Create alert borders on the inputs that have an alert message associated
    for (let listalerts of list) {
      if (listalerts.camposAlerta !== null) {
        for (let alertsfield of listalerts.camposAlerta) {
          element = document.getElementsByName(alertsfield)[0];
          // If the element is not null then add the class
          if (element !== undefined) {
            element.classList.add('alertValidationItem');
          }
        }
      }
    }
  }

  paintErrors(list: any) {
    let element: any;

    if (list) {
      // Create errors borders on the inputs that have an error message associated
      for (let listerrors of list) {
        if (listerrors.camposErro !== null) {
          for (let errorsfield of listerrors.camposErro) {
            element = document.getElementsByName(errorsfield)[0];
            // If the element is not null then add the class
            if (element !== undefined) {
              element.classList.add('errorValidationItem');
            }
          }
        }
      }
    }
  }

  cleanPaintErrors() {
    // While there is elements with class 'errorValidationItem' clear out
    while (this.elementsErrors.length) {
      this.elementsErrors[0].className = this.elementsErrors[0].className.replace(
        /\berrorValidationItem\b/g,
        ''
      );
    }
  }

  cleanPaintAlerts() {
    // While there is elements with class 'balertValidationItem' clear out
    while (this.elementsAlerts.length) {
      this.elementsAlerts[0].className = this.elementsAlerts[0].className.replace(
        /\balertValidationItem\b/g,
        ''
      );
    }
  }
}
