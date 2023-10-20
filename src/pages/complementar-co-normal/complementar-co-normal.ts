import { Router } from '@angular/router';
import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import {
  NavController,
  NavParams,
  ModalController,
  MenuController,
  AlertController
} from '@ionic/angular'; //Content

// Forms
import {
  FormControl,
  FormGroup,
  FormBuilder,
  ValidatorFn
} from '@angular/forms';

// Pages
import { CertificadoObitoNormal } from '../../models/co-normal-model';

// Components
import { ListModalComponent } from '../../components/list-modal/list-modal';
import { SucessoCoNormalPageComponent } from '../sucesso-co-normal/sucesso-co-normal';

// Providers
import { MsicoAlertsProvider } from '../../providers/msico-alerts/msico-alerts';
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';
import { MsicoGeneratePdfProvider } from '../../providers/msico-generate-pdf/msico-generate-pdf';
import { MsicoUserManagerProvider } from '../../providers/msico-user-manager/msico-user-manager';
import { MsicoWebServicesConormalProvider } from '../../providers/msico-web-services-conormal/msico-web-services-conormal';

// MomentJS
import * as moment from 'moment';

@Component({
  selector: 'page-complementar-co-normal',
  templateUrl: 'complementar-co-normal.html'
})
export class ComplementarCoNormalPageComponent implements OnInit {
  //@ViewChild(Content) content: Content;

  readonly iconArrowUp = 'ios-arrow-up-outline';
  readonly iconArrowDown = 'ios-arrow-down-outline';

  coNormalForm: FormGroup;

  // Labels
  public causaMorteLabel = '<Escolher>';
  public tipoObitoLabel = '<Escolher>';
  public localObitoLabel = '<Escolher>';
  public tpMorteMulherLabel = '<Escolher>';
  public instituicaoMoradaProLabel = '<Escolher>';
  public instituicaoSaudeObitoLabel = '<Escolher>';
  public instituicaoSaudeMoradaProfissionalLabel = '<Escolher>';
  public servicoLabel = '<Escolher>';
  readonly numBIAlertLabel = 'O não preenchimento do número de Identificação Civil pode dificultar a identificação da pessoa falecida e a filiação, tem a certeza que pretende continuar?';
  readonly numUtenteAlertLabel = 'O não preenchimento do Número de Utente do SNS dificulta o reporte do óbito ao Registo Nacional de Utente (RNU), tem a certeza que pretende continuar?';
  readonly numBIAndNumUtenteAlertLabel = 'O Número de Identificação Civil e o Número de Utente do SNS não estão identificados. O não preenchimento de qualquer um dos campos dificulta a identificação da pessoa falecida e a filiação. Tem a certeza que são desconhecidos?';
  readonly localObitoInfoLabel = 'Selecionar «outro local» sempre que o óbito ocorra numa Instituição/Estabelecimento de apoio social e identificar a Instituição/Estabelecimento.';

  // selectOptionsSexo
  public selectOptionsSexo = {
    title: 'Sexo'
  };

  // selectOptionsEstadoCivil
  public selectOptionsEstadoCivil = {
    title: 'Estado Civil'
  };

  // selectOptionsNacionalidade
  public selectOptionsNacionalidade = {
    title: 'Nacionalidade'
  };

  // selectOptionsNaturalidadePais
  public selectOptionsPais = {
    title: 'País'
  };

  // selectOptionsNaturalidadeDistrito
  public selectOptionsDistrito = {
    title: 'Distrito'
  };

  // selectOptionsNaturalidadeConcelho
  public selectOptionsConcelho = {
    title: 'Concelho'
  };

  // selectOptionsNaturalidadeFreguesia
  public selectOptionsFreguesia = {
    title: 'Freguesia'
  };

  // selectOptionsResidenciaPais
  public selectOptionsResidenciaPais = {
    title: 'País'
  };

  // selectOptionsResidenciaDistrito
  public selectOptionsResidenciaDistrito = {
    title: 'Distrito (em PT)'
  };

  // selectOptionsResidenciaDistrito
  public selectOptionsResidenciaConcelho = {
    title: 'Concelho (em PT)'
  };

  // selectOptionsResidenciaDistrito
  public selectOptionsResidenciaFreguesia = {
    title: 'Freguesia (em PT)'
  };

  // selectOptionsMoradaProfissional
  public selectOptionsMoradaProfissional = {
    title: 'Morada Profissional'
  };

  // selectOptionsTipoEntidade
  public selectOptionsTipoEntidadeSelecionada = {
    title: 'Tipo Entidade'
  };

  // selectOptionsUnidade
  public selectOptionsUnidade = {
    title: 'Unidade'
  };

  // Inumação
  public selectOptionsInumacao = {
    title: 'Inumação/Cremação'
  };

  // Inumação
  public selectOptionsDoencaInfeciosa = {
    title:
      'Existe doença infeciosa, ou outra circunstância suscetível de transmissão por manipulação de cadáver?'
  };

  // Medico Assistente
  public selectOptionsMedicoAssistente = {
    title: 'Médico Assistente'
  };

  // Medico Assistente
  public selectOptionsTipoContacto = {
    title: 'Tipo de Contacto'
  };

  // Medico Assistente
  public selectOptionsIdServicoObito = {
    title: 'Serviço'
  };

  // Medico Assistente
  public selectOptionsTipoEntidade = {
    title: 'Tipo Entidade'
  };

  // Lists
  list: any;

  // Arrays of the hospitals and instituions
  private listHospistais: any;
  private listMedicoInstSaude: any;

  // Form Parsed
  private formParsed: any;

  // Initial Data Object
  private initialData: any;

  // Control - enables the editable
  public controlDisable: boolean;
  public controlFieldsFromNUIPC: boolean;
  public showOthersMinPublico: boolean;
  public hideAutopsiaRadioButtons: boolean;
  public controlFieldsDispensaAndNuipc: boolean;
  private searchByBIC: boolean;
  private searchBySNSOrBI: boolean;

  // Show Checkmark (SNS and BI)
  public showCheckMarkIcon: any;

  // Show Close (SNS and BI)
  public showCloseIcon: any;

  // Show Close (BIC)
  public showCloseIconBIC: any;

  // Show CheckMark (BIC)
  public showCheckIconBIC: any;

  // Data Emissao
  private dataEmissaoAux: any;
  private dataEmissaoAuxAno: any;
  private dataEmissaoAuxMes: any;
  private dataEmissaoAuxDia: any;

  // Show Submit Message
  public showSubmitMessage: any;
  public showSucessMessage: any;

  // numCOFetalForSucess
  public numCONormalForSucess: string;

  // Booleans
  public errorsOnValidation: any;
  public alertsOnValidation: any;
  public errorsOnInem: any;
  public alertsOnInem: any;
  public blockFieldsNaturalidade: any;
  public blockFieldsResidencia: any;
  public blockFieldLocalObito: any;
  public blockDistritoDesconhecido: any;
  public blockConcelhoDesconhecido: any;
  public blockFreguesiaDesconhecido: any;
  public blockCausaMorte: any;
  public hasClicked: any;
  public blockFieldMorteOcorreu: any;
  public mandatoryFieldMorteOcorreu: any;
  public blockFieldNumProcessoAutopsia: any;
  public blockFieldDataAutopsia: any;
  public blockFieldHoraAutopsia: any;

  // Data Nascimento
  private dataNascimentoAnoAux: any;
  private dataNascimentoMesAux: any;
  private dataNascimentoDiaAux: any;

  // Data Obito
  private obitoAnoAux: any;
  private obitoMesAux: any;
  private obitoDiaAux: any;

  // Desconhecidos - Residencia Habitual
  private desconhecidoPais: any;
  private desconhecidoDistrito: any;
  private desconhecidoConcelho: any;

  // Desconhecidos - Outro Local
  private desconhecidoPaisOutroLocal: any;
  private desconhecidoConcelhoOutroLocal: any;

  // Booleans
  public identFale: boolean;
  public obito: boolean;
  public causasMorte: boolean;
  public medico: boolean;
  public ministerioPublico: boolean;
  public saveCheck: boolean;
  public versoesAnteriores: boolean;
  public showCausasMorteConfidenciais = false;
  public alertResCovid19SuspeitoAux = false;
  public alertLocalObitoInfoAux = false;

  // Icons
  checkIcon = 'ios-checkmark-circle';
  closeIcon = 'ios-close-circle';
  identIcon = this.iconArrowDown;
  obitoIcon = this.iconArrowDown;
  causasMorteIcon = this.iconArrowDown;
  medicoIcon = this.iconArrowDown;
  ministerioPublicoIcon = this.iconArrowDown;
  versoesAnterioresIcon = this.iconArrowDown;

  // List Errors and Alerts of the validation
  listErrorsValidation: any;
  listAlertsValidation: any;

  // List Errors and Alerts of the BI or SNS validation
  listErrorsBISNSValidation: any;
  listAlertsBISNSValidation: any;

  // List Errors and Alerts of BIC validation
  listErrorsBICValidation: any;
  listAlertsBICValidation: any;

  // Inem Validation
  public listAlertasInem: any;
  public listErrorsInem: any;

  // Initial List Model
  private initialList = [
    {
      label: '<Escolher>',
      value: ''
    }
  ];

  // Naturalidade Pais
  public naturalidadePaisList: any;

  // Nacionalidade Pais
  public nacionalidadeList: any;

  // Naturalidade Pais
  public naturalidadeDistritoList: any;

  // Naturalidade Concelho
  public naturalidadeConcelhoList = this.initialList;

  // Naturalidade Freguesia
  public naturalidadeFreguesiaList = this.initialList;

  // Residencia Pais
  public residenciaPaisList: any;

  // Residencia Distrito
  public residenciaDistritoList: any;

  // Residencia Concelho
  public residenciaConcelhoList = this.initialList;

  // Residencia Freguesia
  public residenciaFreguesiaList = this.initialList;

  // Lists Inst Saude
  public instSaudeList: any;

  public localObitoInstSaude: any;

  // Distrito - Local Obito
  public localObitoDistritoList;

  // Concelho - Local Obito
  public localObitoConcelhoList = this.initialList;

  // Freguesia - Local Obito
  public localObitoFreguesiaList = this.initialList;

  // Medico Instituição Saude List
  public medicoInstSaudeList: any;

  // Elements
  private elementsErrors: any;
  private elementsAlerts: any;

  // CONormal Number Retrieved
  public numCONormalRetrieved: any;

  // CONormal Version Retrieved
  public versaoCertificadoCONormal: any;

  // User Role
  public userRole;

  // Data nascimento checkbox controller
  public dataNascimentoChkController = 0;

  // Data obito checkbox controller
  public dataObitoChkController = 0;

  private nuipcInitialValue: any;
  private dispensaAutopInitialValue: any;

  // Service handlers
  public morteOcorreuValidationController = false;

  public listaVersoes: any;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private msicoWebServices: MsicoWebServicesConormalProvider,
    private msicoAlerts: MsicoAlertsProvider,
    private msicoLoading: MsicoLoadingProvider,
    private msicoGeneratePDF: MsicoGeneratePdfProvider,
    private formBuilder: FormBuilder,
    public ngZone: NgZone,
    public menuCtrl: MenuController,
    private msicoUserManagerProvider: MsicoUserManagerProvider,
    public router: Router
  ) {
    this.userRole = this.msicoUserManagerProvider.getUserRole();
  }

  // When clicked scroll to Top
  scrollToTop(): void {
    //this.content.scrollToTop();
  }

  onBlur($event: any): void {
    this.cleanPaintErrors();
    this.cleanPaintAlerts();

    if ($event.value !== undefined && $event.value !== '') {
      if ($event.ngControl.name === 'numBIC') {
        this.getDataBICHandler();
      } else if (
        $event.ngControl.name === 'numBI' ||
        $event.ngControl.name === 'numUtente'
      ) {
        this.getDataFalecidoCONormalHandler();
      }
    } else if ($event.value === '') {
      if ($event.ngControl.name === 'numBIC') {
        this.showCheckIconBIC = false;
        this.showCloseIconBIC = false;

        this.getDataBICHandler();
        /* this.showCheckIconBIC = false;
        this.showCloseIconBIC = false;
        this.controlFieldsFromNUIPC = false;
        this.controlFieldsDispensaAndNuipc = false;

        this.listErrorsBICValidation = null;
        this.listAlertsBICValidation = null;

        if (this.initialData.numBIC !== null) {
          // TODO: Check if its cleaning all the previous errors/alerts
          this.getDataBICHandler();
        } else {
          if (this.coNormalForm.get('coVersaoAnteriorComNuipc').value === false) {
            // If the old bicComNuipc is true
            if (this.coNormalForm.get('bicComNuipc').value) {
              this.coNormalForm.patchValue({
                dispensaAutopsia: ''
              });

              this.coNormalForm.patchValue({
                nuipc: ''
              });

              this.controlFieldsDispensaAndNuipc = false;
            }
          } else {
            this.coNormalForm.controls['nuipc'].setValue(this.nuipcInitialValue);
            this.coNormalForm.controls['dispensaAutopsia'].setValue(
              this.dispensaAutopInitialValue
            );
            this.controlFieldsFromNUIPC = true;
            this.controlFieldsDispensaAndNuipc = true;
          }
          this.coNormalForm.controls['bicComNuipc'].setValue(false);
        }
 */
      } else if (
        $event.ngControl.name === 'numBI' ||
        $event.ngControl.name === 'numUtente'
      ) {
        this.getDataFalecidoCONormalHandler();
      }
    }
  }

  // When clicked scroll to Bottom
  scrollToBottom(): void {
    //this.content.scrollToBottom();
  }

  clickToTheField(value: any): void {
    let top = document.getElementById(value[0]).offsetTop;

    if (top !== 0) {
      //this.content.scrollTo(0, top - 10, 1000);
    }
  }

  doClick(): void {
    this.menuCtrl.enable(true, 'menuregistos');
    this.menuCtrl.open('menuregistos');
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

  // Avoid space input control
  avoidSpaceInput(num: string, tempo: any, event: any, numChar: number) {
    if (event) {
      // Avoid space input
      if (event.value.match(/\s/, '')) {
        event.value = event.value.replace(/\s/, '');
      }

      // Limit value to specified numChar value
      if (num.length > numChar) {
        let obj = this.coNormalForm.get(tempo).value;

        obj = obj.substring(0, num.length - 1);
        this.coNormalForm.controls[tempo].setValue(obj);
      }
    }
  }

  setToUpperCase(tomodified: string, field: string) {
    if (tomodified !== null || tomodified !== undefined) {
      let toUpper = tomodified;

      toUpper = toUpper.toUpperCase();
      toUpper = toUpper.trim();

      this.coNormalForm.controls[field].setValue(toUpper);
    }
  }

  // Init
  ngOnInit() {
    // Add the initialData data from the previous page
    this.ngZone.run(() => {
      //this.initialData = this.navParams.get('initialData');
      //this.list = this.navParams.get('list');

      if (this.router.getCurrentNavigation().extras.state) {
        const params: any = this.router.getCurrentNavigation().extras.state;
  
        this.initialData = params.initialData;
        this.list = params.list;
      }
    });

    // If cmConfidenciaisViaCO value is not null, then show info text 'Causas de morte confidenciais'
    if (this.initialData.cmConfidenciaisViaCO !== null) {
      this.showCausasMorteConfidenciais = true;
    }

    this.listaVersoes = this.initialData.listaVersoes;

    this.numCONormalRetrieved = this.initialData.numCertificado;

    this.nuipcInitialValue = this.initialData.nuipc;
    this.dispensaAutopInitialValue = this.initialData.dispensaAutopsia;

    this.controlFieldsFromNUIPC = false;

    this.naturalidadePaisList = this.list.naturalidadePais;
    this.naturalidadeDistritoList = this.list.naturalidadeDistrito;

    this.nacionalidadeList = this.list.listaPaises;

    this.residenciaPaisList = this.list.residenciaPais;
    this.residenciaDistritoList = this.list.residenciaDistrito;

    // Local Obito
    this.localObitoDistritoList = this.list.localObitoDistrito;

    this.coNormalForm = this.formBuilder.group({
      idCO: new FormControl({
        value: this.initialData.idCO,
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
      nomeFalecido: new FormControl({
        value: this.initialData.nomeFalecido,
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
      sexo: new FormControl({
        value: this.initialData.sexo,
        disabled: this.controlDisable
      }),
      chkNascDesconhecida: new FormControl({
        value: this.initialData.chkNascDesconhecida,
        disabled: this.controlDisable
      }),
      dataNascimento: new FormControl({
        value: this.initialData.dataNascimento,
        disabled: this.controlDisable
      }),
      nascimentoDia: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      nascimentoMes: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      nascimentoAno: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      nacionalidade: new FormControl({
        value: this.initialData.nacionalidade,
        disabled: this.controlDisable
      }),
      estadoCivil: new FormControl({
        value: this.initialData.estadoCivil,
        disabled: this.controlDisable
      }),
      paisNaturalidade: new FormControl({
        value: this.initialData.paisNaturalidade,
        disabled: this.controlDisable
      }),
      freguesiaNaturalidade: new FormControl({
        value: this.initialData.freguesiaNaturalidade,
        disabled: this.controlDisable
      }),
      concelhoNaturalidade: new FormControl({
        value: this.initialData.concelhoNaturalidade,
        disabled: this.controlDisable
      }),
      distritoNaturalidade: new FormControl({
        value: this.initialData.distritoNaturalidade,
        disabled: this.controlDisable
      }),
      residencia: new FormControl({
        value: this.initialData.residencia,
        disabled: this.controlDisable
      }),
      servicoLocal: new FormControl({
        value: this.initialData.servicoLocal,
        disabled: this.controlDisable
      }),
      freguesiaResidencia: new FormControl({
        value: this.initialData.freguesiaResidencia,
        disabled: this.controlDisable
      }),
      concelhoResidencia: new FormControl({
        value: this.initialData.concelhoResidencia,
        disabled: this.controlDisable
      }),
      distritoResidencia: new FormControl({
        value: this.initialData.distritoResidencia,
        disabled: this.controlDisable
      }),
      codigoSaudeProfissionalServico: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      paisResidencia: new FormControl({
        value: this.initialData.paisResidencia,
        disabled: this.controlDisable
      }),
      profissao: new FormControl({
        value: this.initialData.profissao,
        disabled: this.controlDisable
      }),
      outraProfissao: new FormControl({
        value: this.initialData.outraProfissao,
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
        value: '',
        disabled: this.controlDisable
      }),
      tipoObitoNatural: new FormControl({
        value: '',
        disabled: this.controlDisable
      }), */
      descOutroAcidente: new FormControl({
        value: this.initialData.descOutroAcidente,
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
        value: '',
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
        value: '',
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
        value: '',
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
        value: '',
        disabled: this.controlDisable
      }),
      outroCmD: new FormControl({
        value: this.initialData.outroCmD,
        disabled: this.controlDisable
      }),
      tempoCmD: new FormControl({
        value: this.initialData.tempoCmD,
        disabled: this.controlDisable
      }),
      unidTemporalCmD: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      capituloCmOutros: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      grupoCmOutros: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      categoriaCmOutros: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      subCategoriaCmOutros: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      outroCmOutros: new FormControl({
        value: this.initialData.outroCmOutros,
        disabled: this.controlDisable
      }),
      tempoCmOutros: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      unidTemporalCmOutros: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      realizaAutopsia: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      dataObito: new FormControl({ value: '', disabled: this.controlDisable }),
      obitoDia: new FormControl({ value: '', disabled: this.controlDisable }),
      obitoMes: new FormControl({ value: '', disabled: this.controlDisable }),
      obitoAno: new FormControl({ value: '', disabled: this.controlDisable }),
      chkObitoDesconhecida: new FormControl({
        value: this.initialData.chkObitoDesconhecida,
        disabled: this.controlDisable
      }),
      chkHoraObitoDesconhecida: new FormControl({
        value: this.initialData.chkHoraObitoDesconhecida,
        disabled: this.controlDisable
      }),
      horaObito: new FormControl({
        value: this.initialData.horaObito,
        disabled: this.controlDisable
      }),
      baseCausaMorte: new FormControl({
        value: this.initialData.baseCausaMorte,
        disabled: this.controlDisable
      }),
      dataAutopsia: new FormControl({
        value: '',
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
      localObito: new FormControl({
        value: this.initialData.localObito,
        disabled: this.controlDisable
      }),
      outroLocal: new FormControl({
        value: this.initialData.outroLocal,
        disabled: this.controlDisable
      }),
      morteOcorreu: new FormControl({
        value: this.initialData.morteOcorreu,
        disabled: this.controlDisable
      }),
      inumacaoCremacao: new FormControl({
        value: this.initialData.inumacaoCremacao,
        disabled: this.controlDisable
      }),
      motivoInumacaoCremacao: new FormControl({
        value: this.initialData.motivoInumacaoCremacao,
        disabled: this.controlDisable
      }),
      medicoAssistente: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      doencaInfeciosa: new FormControl({
        value: this.initialData.doencaInfeciosa,
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
        value: '',
        disabled: this.controlDisable
      }),
      codigoSaudeProfissional: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      moradaProfissional: new FormControl({
        value: this.initialData.moradaProfissional,
        disabled: this.controlDisable
      }),
      moradaProfissionalServicoOutro: new FormControl({
        value: this.initialData.moradaProfissionalServicoOutro,
        disabled: this.controlDisable
      }),
      numCedulaProfissional: new FormControl({
        value: this.initialData.numCedulaProfissional,
        disabled: true
      }),
      tipoContacto: new FormControl({
        value: this.initialData.tipoContacto,
        disabled: this.controlDisable
      }),
      descContacto: new FormControl({
        value: this.initialData.descContacto,
        disabled: this.controlDisable
      }),
      emailDispAutopsia: new FormControl({
        value: this.initialData.emailDispAutopsia,
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
      distritoConservatoria: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      concelhoConservatoria: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      descConservatoria: new FormControl({
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
      assinatura: new FormControl({ value: '', disabled: this.controlDisable }),
      numCodu: new FormControl({ value: '', disabled: this.controlDisable }),
      nuipc: new FormControl({
        value: this.initialData.nuipc,
        disabled: this.controlDisable
      }),
      coVersaoAnteriorComNuipc: new FormControl({
        value: this.initialData.coVersaoAnteriorComNuipc,
        disabled: this.controlDisable
      }),
      numBIC: new FormControl({
        value: this.initialData.numBIC,
        disabled: this.controlDisable
      }),
      cmConfidenciais: new FormControl({
        value: this.initialData.cmConfidenciais,
        disabled: this.controlDisable
      }),
      estadoIRN: new FormControl({ value: '', disabled: this.controlDisable }),
      dataEstadoIRN: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      estadoINE: new FormControl({ value: '', disabled: this.controlDisable }),
      dataEstadoINE: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      estadoRNU: new FormControl({ value: '', disabled: this.controlDisable }),
      dataEstadoRNU: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      mensagemIRN: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      mensagemRNU: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      mensagemINE: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      novoEstadoIRN: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      novoEstadoRNU: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      novoEstadoINE: new FormControl({
        value: '',
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
      tempoOutros: new FormControl({
        value: this.initialData.tempoOutros,
        disabled: this.controlDisable
      }),
      unidTempoOutros: new FormControl({
        value: this.initialData.unidTempoOutros,
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
      bicComNuipc: new FormControl({
        value: false,
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
      selectEntidade: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      tipoEntidadeSelecionada: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      selectEntidadeObito: new FormControl({
        value: this.initialData.selectEntidadeObito,
        disabled: this.controlDisable
      }),
      ativarCid: new FormControl({ value: '', disabled: this.controlDisable }),
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
      chkProfissaoDesconhecida: new FormControl({
        value: this.initialData.chkProfissaoDesconhecida,
        disabled: this.controlDisable
      }),
      chkDistritoLDesconhecida: new FormControl({
        value: this.initialData.chkDistritoLDesconhecida,
        disabled: this.controlDisable
      }),
      chkConcelhoLDesconhecida: new FormControl({
        value: this.initialData.chkConcelhoLDesconhecida,
        disabled: this.controlDisable
      }),
      chkFreguesiaLDesconhecida: new FormControl({
        value: this.initialData.chkFreguesiaLDesconhecida,
        disabled: this.controlDisable
      }),
      idHospitaisObito: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      idUACObito: new FormControl({ value: '', disabled: this.controlDisable }),
      idOutroObito: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      idServicoObito: new FormControl({
        value: this.initialData.idServicoObito,
        disabled: this.controlDisable
      }),
      servicoObitoOutro: new FormControl({
        value: this.initialData.servicoObitoOutro,
        disabled: this.controlDisable
      })
    });

    this.elementsErrors = document.getElementsByClassName(
      'errorValidationItem'
    );
    this.elementsAlerts = document.getElementsByClassName(
      'alertValidationItem'
    );

    // Dates for fill needs to be parsed
    if (this.initialData.nascimentoAno) {
      this.coNormalForm.patchValue({
        dataNascimento:
          this.pad(this.initialData.nascimentoAno, 2, 0) +
          '-' +
          this.pad(this.initialData.nascimentoMes, 2, 0) +
          '-' +
          this.pad(this.initialData.nascimentoDia, 2, 0)
      });
    }

    // Local Obito List
    this.localObitoConcelhoList = this.list.localObitoConcelho;
    this.localObitoFreguesiaList = this.list.localObitoFreguesia;

    // Data Nascimento
    this.dataNascimentoAnoAux = this.initialData.nascimentoAno;
    this.dataNascimentoMesAux = this.initialData.nascimentoMes;
    this.dataNascimentoDiaAux = this.initialData.nascimentoDia;

    // List Concelho and Freguesia (Naturalidade)
    this.naturalidadeConcelhoList = this.list.naturalidadeConcelho;
    this.naturalidadeFreguesiaList = this.list.naturalidadeFreguesia;

    // List Concelho and Freguesia (Residencia)
    this.residenciaConcelhoList = this.list.residenciaConcelho;
    this.residenciaFreguesiaList = this.list.residenciaFreguesia;

    // Tipo Obito Selected Label
    this.tipoObitoLabel = this.initialData.tipoObitoSelectedDesc;

    // Local Obito Label
    this.localObitoLabel = this.initialData.localObitoDesc;

    // Naturalidade País
    this.paisNaturalidadeHandler();

    // Instituições Saude
    this.populateInstSaudeList();

    if (this.initialData.selectEntidadeObito === '1') {
      this.instituicaoSaudeObitoLabel = this.initialData.idHospitaisObitoDesc;
    } else if (this.initialData.selectEntidadeObito === '2') {
      this.instituicaoSaudeObitoLabel = this.initialData.idUACObitoDesc;
    } else if (this.initialData.selectEntidadeObito === '3') {
      this.instituicaoSaudeObitoLabel = this.initialData.idOutroObitoDesc;
    }

    this.coNormalForm.patchValue({
      localObitoInstSaude: this.initialData.selectEntidadeObito
    });

    if (this.coNormalForm.get('selectEntidadeObito').value === '1') {
      this.coNormalForm.patchValue({
        idHospitaisObito: this.initialData.idHospitaisObito
      });
    } else if (this.coNormalForm.get('selectEntidadeObito').value === '2') {
      this.coNormalForm.patchValue({ idUACObito: this.initialData.idUACObito });
    } else if (this.coNormalForm.get('selectEntidadeObito').value === '3') {
      this.coNormalForm.patchValue({
        idOutroObito: this.initialData.idOutroObito
      });
    }

    // Serviço Obito
    this.coNormalForm.patchValue({
      idServicoObito: this.initialData.idServicoObito
    });

    // Causa Morte Label
    this.causaMorteLabel = this.initialData.baseCausaMorteDesc;

    // Se mulher entre
    if (this.initialData.morteOcorreuDesc) {
      this.tpMorteMulherLabel = this.initialData.morteOcorreuDesc;
    }

    // Data Obito (Ano, Mes, Dia)
    if (this.initialData.obitoAno) {
      this.coNormalForm.patchValue({
        dataObito:
          this.initialData.obitoAno +
          '-' +
          this.initialData.obitoMes +
          '-' +
          this.initialData.obitoDia
      });
    }

    // Data Autopsia (Ano, Mes, Dia)
    if (this.initialData.dataAutopsia) {
      this.coNormalForm.patchValue({
        dataAutopsia:
          this.dateChangeFormat(this.initialData.dataAutopsia)[2] +
          '-' +
          this.dateChangeFormat(this.initialData.dataAutopsia)[1] +
          '-' +
          this.dateChangeFormat(this.initialData.dataAutopsia)[0]
      });
    }

    // Tipo Obito
    this.tipoObitoDataFromServer(this.initialData);

    // Booleans
    this.errorsOnValidation = false;
    this.alertsOnValidation = false;
    this.alertsOnInem = false;
    this.errorsOnInem = false;
    this.showSucessMessage = false;
    this.controlDisable = false;
    this.searchByBIC = false;
    this.searchBySNSOrBI = false;
    this.desconhecidoPais = false;
    this.desconhecidoDistrito = false;
    this.desconhecidoConcelho = false;
    this.desconhecidoPaisOutroLocal = false;
    this.desconhecidoConcelhoOutroLocal = false;
    this.blockFieldMorteOcorreu = false;
    this.mandatoryFieldMorteOcorreu = false;

    // Passing the values from servr to obitoAnoAux, obitoMesAux, obitoDiaAux
    this.obitoAnoAux = this.initialData.obitoAno;
    this.obitoMesAux = this.initialData.obitoMes;
    this.obitoDiaAux = this.initialData.obitoDia;

    // Data Emissao (Ano, Mes, Dia) - it will be use to other web services
    let dateString = this.coNormalForm.get('dataEmissao').value.split('-');

    // Data Emissao (Ano, Mes, Dia)
    let dataEmissao = new Date(
      dateString[2],
      dateString[1] - 1,
      dateString[0]
    ).toISOString();

    this.dataEmissaoAux = dateString[2] + '-' + dateString[1] + '-' + dateString[0];
    this.dataEmissaoAuxAno = dateString[2];
    this.dataEmissaoAuxMes = ('0' + dateString[1]).slice(-2);
    this.dataEmissaoAuxDia = dateString[0];

    // Local Obito (Pais, Concelho, Freguesia)
    this.paisLocalObitoHandler((this.hasClicked = false));
    this.populateLocalObitoConcelhoList((this.hasClicked = false));
    this.populateLocalObitoFreguesiaList((this.hasClicked = false));

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

    // Validate date for morteOcorreu field block
    this.morteOcorreuFieldBlock();

    if (this.coNormalForm.get('baseCausaMorte').value) {
      if (this.coNormalForm.get('baseCausaMorte').value === '2' || this.coNormalForm.get('baseCausaMorte').value === '3') {
        this.camposAutopsiaFieldBlock();
      }
    }

    // Check if resCovid19 field is already with "Suspeito" option
    if (this.coNormalForm.get('resCovid19').value === 'S') {
      this.alertResCovid19SuspeitoAux = true;
    }

    // Check if localObito field is already with value
    if (this.coNormalForm.get('localObito').value) {
      this.alertLocalObitoInfoAux = true;
    }
  }

  // Create PDF from base64 string
  pdfHandler(value: string, err: any, data: any): void {
    if (value === 'ImpressaoGuia') {
      this.msicoLoading.onLoading();

      // Call the web services to get the 64 binary code
      this.msicoWebServices
        .getCONormalPdf64(
          this.coNormalForm.get('idCO').value,
          'guia_transporte'
        )
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
        .getCONormalPdf64(this.coNormalForm.get('idCO').value, 'co_normal')
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
        .getCONormalPdf64(this.coNormalForm.get('idCO').value, 'co_normal_bpel')
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

  // It handles the show and hide sections of the form
  accordionHandler(sectionDescription: any): void {
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
    // Versões Anteriores
    if (sectionDescription === 'versoesAnteriores') {
      this.versoesAnteriores = !this.versoesAnteriores;
      this.versoesAnterioresIcon = this.versoesAnteriores
        ? this.iconArrowUp
        : this.iconArrowDown;
    }
  }

  // If the current time of obito is 00:00 then show an alert
  timeHandler(): void {
    if (this.coNormalForm.get('horaObito').value === '00:00') {
      this.msicoAlerts.onTimeError();
    }
  }

  // An content pane that display different domain lists, on a full page
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
      // Causa Morte which has the label to be represent on the form and the data to be sent to the server
      this.causaMorteLabel = data.labelData;
      this.coNormalForm.patchValue({ baseCausaMorte: data.DataData });
      if (this.coNormalForm.get('baseCausaMorte').value === '1' ||
          this.coNormalForm.get('baseCausaMorte').value === '4' ||
          this.coNormalForm.get('baseCausaMorte').value === '5' ||
          this.coNormalForm.get('baseCausaMorte').value === '6'
          ) {
        this.coNormalForm.patchValue({ dataAutopsia: '' });
        this.coNormalForm.patchValue({ horaAutopsia: '' });
        this.coNormalForm.patchValue({ numProcessoAutopsia: '' });
      }
      if (this.coNormalForm.get('baseCausaMorte').value === '2' ||
          this.coNormalForm.get('baseCausaMorte').value === '3'
          ) {
        this.camposAutopsiaFieldBlock();
      }
    } else if (typeofList === 'tipoObito') {
      // Tipo Obito which has the label to be represent on the form and the data to be sent to the server
      this.tipoObitoLabel = data.labelData;
      this.coNormalForm.patchValue({ tipoObitoSelected: data.DataData });

      this.coNormalForm.patchValue({ descOutroAcidente: '' });

      if (
        this.coNormalForm.get('tipoObitoSelected').value === '11' ||
        this.coNormalForm.get('tipoObitoSelected').value === '9'
      ) {
        this.blockCausaMorte = true;

        this.coNormalForm.patchValue({ outroCmA: '' });
        this.coNormalForm.patchValue({ tempoA: '' });
        this.coNormalForm.patchValue({ unidTempoA: '' });
        this.coNormalForm.patchValue({ outroCmB: '' });
        this.coNormalForm.patchValue({ tempoB: '' });
        this.coNormalForm.patchValue({ unidTempoB: '' });
        this.coNormalForm.patchValue({ outroCmC: '' });
        this.coNormalForm.patchValue({ tempoC: '' });
        this.coNormalForm.patchValue({ unidTempoC: '' });
        this.coNormalForm.patchValue({ outroCmD: '' });
        this.coNormalForm.patchValue({ tempoD: '' });
        this.coNormalForm.patchValue({ unidTempoD: '' });
        this.coNormalForm.patchValue({ outroCmOutros: '' });
        this.coNormalForm.patchValue({ tempoOutros: '' });
        this.coNormalForm.patchValue({ unidTempoOutros: '' });
      } else {
        this.blockCausaMorte = false;
      }
    } else if (typeofList === 'localObito') {
      this.instituicaoSaudeObitoLabel = '<Escolher>';
      this.coNormalForm.patchValue({ idServicoObito: '' });
      this.coNormalForm.patchValue({ servicoObitoOutro: '' });
      this.coNormalForm.patchValue({ outroLocal: '' });
      this.coNormalForm.patchValue({ distritoLocalObito: '' });
      this.coNormalForm.patchValue({ concelhoLocalObito: '' });
      this.coNormalForm.patchValue({ freguesiaLocalObito: '' });
      this.coNormalForm.patchValue({ selectEntidadeObito: null });

      this.blockFieldLocalObito = false;

      // Concelho - Local Obito
      this.localObitoConcelhoList = this.initialList;

      // Freguesia - Local Obito
      this.localObitoFreguesiaList = this.initialList;

      // Submit the Desconhecidos to false
      this.coNormalForm.patchValue({
        chkDistritoLDesconhecida: false
      });
      this.coNormalForm.patchValue({
        chkConcelhoLDesconhecida: false
      });
      this.coNormalForm.patchValue({
        chkFreguesiaLDesconhecida: false
      });

      // Local Obito which has the label to be represent on the form and the data to be sent to the server
      this.localObitoLabel = data.labelData;
      this.coNormalForm.patchValue({ localObito: data.DataData });

      this.coNormalForm.patchValue({ idHospitaisObito: '' });
      this.coNormalForm.patchValue({ idUACObito: '' });
      this.coNormalForm.patchValue({ idOutroObito: '' });
      this.coNormalForm.patchValue({ localObitoInstSaude: '' });

      // If it is select 'Domicilio' the default country should be PT
      this.defaultCountry();
    } else if (typeofList === 'tpMorteMulher') {
      // tpMorteMulher which has the label to be represent on the form and the data to be sent to the server
      this.tpMorteMulherLabel = data.labelData;
      this.coNormalForm.patchValue({ morteOcorreu: data.DataData });
    } else if (typeofList === 'instituicaoMoradaPro') {
      // instituicaoMoradaPro which has the label to be represent on the form and the data to be sent to the server
      this.instituicaoMoradaProLabel = data.labelData;
      this.coNormalForm.patchValue({ codigoInmlProfissional: data.DataData });
    } else if (typeofList === 'instSaudeObito') {
      // instSaudeObito which has the label to be represent on the form and the data to be sent to the server
      this.instituicaoSaudeObitoLabel = data.labelData;
      this.coNormalForm.patchValue({ localObitoInstSaude: data.DataData });

      if (this.coNormalForm.get('selectEntidadeObito').value === '1') {
        this.coNormalForm.patchValue({ idHospitaisObito: data.DataData });
      } else if (this.coNormalForm.get('selectEntidadeObito').value === '2') {
        this.coNormalForm.patchValue({ idUACObito: data.DataData });
      } else if (this.coNormalForm.get('selectEntidadeObito').value === '3') {
        this.coNormalForm.patchValue({ idOutroObito: data.DataData });
      }
    } else if (typeofList === 'instSaudeMoradaProfissional') {
      /*instSaudeMoradaProfissional which has the label to be represent
      on the form and the data to be sent to the server*/
      this.instituicaoSaudeMoradaProfissionalLabel = data.labelData;
      this.coNormalForm.patchValue({ codigoSaudeProfissional: data.DataData });
    } else if (typeofList === 'codigoSaudeProfissionalServico') {
      /*codigoSaudeProfissionalServico which has the label to be represent
      on the form and the data to be sent to the server*/
      this.servicoLabel = data.labelData;
      this.coNormalForm.patchValue({
        codigoSaudeProfissionalServico: data.DataData
      });
    }
  }

  cleanQual() {
    this.coNormalForm.patchValue({ servicoObitoOutro: '' });
  }

  // Clean the current input from the form
  cleanProfissao(): void {
    this.coNormalForm.patchValue({ profissao: '' });
  }

  // Handles the date of birth
  dataNascimentoHandler(): void {
    // If handler has been called then change the dataNascimentoChkController value
    this.dataNascimentoChkController = 1;

    // If the dataNascimento is not null then parse the value
    if (this.coNormalForm.get('dataNascimento').value) {
      let dataNascimento = new Date(
        this.coNormalForm.get('dataNascimento').value
      );

      this.dataNascimentoAnoAux = dataNascimento.getFullYear().toString();
      this.dataNascimentoMesAux = ('0' + (dataNascimento.getMonth() + 1)).slice(
        -2
      );
      this.dataNascimentoDiaAux = ('0' + dataNascimento.getDate()).slice(-2);
    }

    // Extra remove loading method to prevent loading controller malfunction
    this.msicoLoading.onLoadingRemove();

    if (
      this.coNormalForm.get('dataNascimento').value !== null &&
      !this.searchByBIC &&
      !this.searchBySNSOrBI
    ) {
      this.msicoLoading.onLoading();

      // Call the webservices to get the specific list
      this.msicoWebServices
        .getListDomSpecificCONormalDataNascimentoServices(
          this.dataNascimentoAnoAux,
          this.dataNascimentoMesAux,
          this.dataNascimentoDiaAux,
          this.coNormalForm.get('distritoNaturalidade').value,
          this.coNormalForm.get('concelhoNaturalidade').value,
          this.dataEmissaoAuxAno,
          this.dataEmissaoAuxMes,
          this.dataEmissaoAuxDia
        )
        .subscribe(
          data => {
            let dataRetrieved: any = data;

            if (dataRetrieved.dadosOutput !== null) {
              if (dataRetrieved.dadosOutput.naturalidadePais) {
                this.list.naturalidadePais =
                  dataRetrieved.dadosOutput.naturalidadePais;
              }
              if (dataRetrieved.dadosOutput.naturalidadeDistrito) {
                // Check if distritoNaturalidade's value exists in new naturalidadeDistrito list from server (if not, clean associated fields)
                let naturalidadeDistritoServerList = dataRetrieved.dadosOutput.naturalidadeDistrito.map(a => a.value);
                if (!naturalidadeDistritoServerList.includes(this.coNormalForm.get('distritoNaturalidade').value)) {
                  this.coNormalForm.patchValue({ distritoNaturalidade: '' });
                  this.coNormalForm.patchValue({ concelhoNaturalidade: '' });
                  this.coNormalForm.patchValue({ freguesiaNaturalidade: '' });
                }

                this.naturalidadeDistritoList =
                  dataRetrieved.dadosOutput.naturalidadeDistrito;
              }
              if (dataRetrieved.dadosOutput.naturalidadeConcelho) {
                // Check if concelhoNaturalidade's value exists in new naturalidadeConcelho list from server (if not, clean associated fields)
                let naturalidadeConcelhoServerList = dataRetrieved.dadosOutput.naturalidadeConcelho.map(a => a.value);
                if (!naturalidadeConcelhoServerList.includes(this.coNormalForm.get('concelhoNaturalidade').value)) {
                  this.coNormalForm.patchValue({ concelhoNaturalidade: '' });
                  this.coNormalForm.patchValue({ freguesiaNaturalidade: '' });
                }

                this.naturalidadeConcelhoList =
                  dataRetrieved.dadosOutput.naturalidadeConcelho;
              }
              if (dataRetrieved.dadosOutput.naturalidadeFreguesia) {
                // Check if freguesiaNaturalidade's value exists in new naturalidadeFreguesia list from server (if not, clean associated fields)
                let naturalidadeFreguesiaServerList = dataRetrieved.dadosOutput.naturalidadeFreguesia.map(a => a.value);
                if (!naturalidadeFreguesiaServerList.includes(this.coNormalForm.get('freguesiaNaturalidade').value)) {
                  this.coNormalForm.patchValue({ freguesiaNaturalidade: '' });
                }

                this.naturalidadeFreguesiaList =
                  dataRetrieved.dadosOutput.naturalidadeFreguesia;
              }

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
    if (!this.morteOcorreuValidationController) {
      // Validate date for morteOcorreu field block
      this.morteOcorreuFieldBlock();
    }
  }

  // Handles the date of the death
  dataObitoHandler(e?: any): void {
    let dataObito: Date;

    // If handler has been called then change the dataObitoChkController value
    this.dataObitoChkController = 1;

    // If the dataObito is not null then parse the value
    if (this.coNormalForm.get('dataObito').value) {
      dataObito = new Date(this.coNormalForm.get('dataObito').value);

      this.obitoAnoAux = dataObito.getFullYear().toString();
      this.obitoMesAux = ('0' + (dataObito.getMonth() + 1)).slice(-2);
      this.obitoDiaAux = ('0' + dataObito.getDate()).slice(-2);
    }

    // Extra remove loading method to prevent loading controller malfunction
    this.msicoLoading.onLoadingRemove();

    if (
      this.coNormalForm.get('dataObito').value !== null &&
      !this.searchByBIC &&
      !this.searchBySNSOrBI
    ) {
      this.msicoLoading.onLoading();

      // Call the webservices to get the specific list
      this.msicoWebServices
        .getListDomSpecificCONormalDataObitoServices(
          this.obitoAnoAux,
          this.obitoMesAux,
          this.obitoDiaAux,
          this.coNormalForm.get('distritoLocalObito').value,
          this.coNormalForm.get('concelhoLocalObito').value,
          this.coNormalForm.get('distritoResidencia').value,
          this.coNormalForm.get('concelhoResidencia').value,
          this.dataEmissaoAuxAno,
          this.dataEmissaoAuxMes,
          this.dataEmissaoAuxDia
        )
        .subscribe(
          data => {
            let dataRetrieved: any = data;

            this.list.residenciaPais = dataRetrieved.dadosOutput.listaPaises;

            if (dataRetrieved.dadosOutput.localObitoDistrito) {
              // Check if distritoLocalObito's value exists in new localObitoDistrito list from server (if not, clean associated fields)
              let localObitoDistritoServerList = dataRetrieved.dadosOutput.localObitoDistrito.map(a => a.value);
              if (!localObitoDistritoServerList.includes(this.coNormalForm.get('distritoLocalObito').value)) {
                this.coNormalForm.patchValue({ distritoLocalObito: '' });
                this.coNormalForm.patchValue({ concelhoLocalObito: '' });
                this.coNormalForm.patchValue({ freguesiaLocalObito: '' });
              }
              this.localObitoDistritoList =
                dataRetrieved.dadosOutput.localObitoDistrito;
            }

            if (dataRetrieved.dadosOutput.localObitoConcelho) {
              // Check if concelhoLocalObito's value exists in new localObitoConcelho list from server (if not, clean associated fields)
              let localObitoConcelhoServerList = dataRetrieved.dadosOutput.localObitoConcelho.map(a => a.value);
              if (!localObitoConcelhoServerList.includes(this.coNormalForm.get('concelhoLocalObito').value)) {
                this.coNormalForm.patchValue({ concelhoLocalObito: '' });
                this.coNormalForm.patchValue({ freguesiaLocalObito: '' });
              }

              this.localObitoConcelhoList =
                dataRetrieved.dadosOutput.localObitoConcelho;
            }

            if (dataRetrieved.dadosOutput.localObitoFreguesia) {
              // Check if freguesiaLocalObito's value exists in new localObitoFreguesia list from server (if not, clean associated fields)
              let localObitoFreguesiaServerList = dataRetrieved.dadosOutput.localObitoFreguesia.map(a => a.value);
              if (!localObitoFreguesiaServerList.includes(this.coNormalForm.get('freguesiaLocalObito').value)) {
                this.coNormalForm.patchValue({ freguesiaLocalObito: '' });
              }

              this.localObitoFreguesiaList =
                dataRetrieved.dadosOutput.localObitoFreguesia;
            }

            if (dataRetrieved.dadosOutput.residenciaDistrito) {
              // Check if distritoResidencia's value exists in new residenciaDistrito list from server (if not, clean associated fields)
              let residenciaDistritoServerList = dataRetrieved.dadosOutput.residenciaDistrito.map(a => a.value);
              if (!residenciaDistritoServerList.includes(this.coNormalForm.get('distritoResidencia').value)) {
                this.coNormalForm.patchValue({ distritoResidencia: '' });
                this.coNormalForm.patchValue({ concelhoResidencia: '' });
                this.coNormalForm.patchValue({ freguesiaResidencia: '' });
              }
              this.list.residenciaDistrito =
                dataRetrieved.dadosOutput.residenciaDistrito;
            }

            if (dataRetrieved.dadosOutput.residenciaConcelho) {
              // Check if concelhoResidencia's value exists in new residenciaConcelho list from server (if not, clean associated fields)
              let residenciaConcelhoServerList = dataRetrieved.dadosOutput.residenciaConcelho.map(a => a.value);
              if (!residenciaConcelhoServerList.includes(this.coNormalForm.get('concelhoResidencia').value)) {
                this.coNormalForm.patchValue({ concelhoResidencia: '' });
                this.coNormalForm.patchValue({ freguesiaResidencia: '' });
              }
              this.residenciaConcelhoList =
                dataRetrieved.dadosOutput.residenciaConcelho;
            }

            if (dataRetrieved.dadosOutput.residenciaFreguesia) {
              // Check if freguesiaResidencia's value exists in new residenciaFreguesia list from server (if not, clean associated fields)
              let residenciaFreguesiaServerList = dataRetrieved.dadosOutput.residenciaFreguesia.map(a => a.value);
              if (!residenciaFreguesiaServerList.includes(this.coNormalForm.get('freguesiaResidencia').value)) {
                this.coNormalForm.patchValue({ freguesiaResidencia: '' });
              }
              this.residenciaFreguesiaList =
                dataRetrieved.dadosOutput.residenciaFreguesia;
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
    if (!this.morteOcorreuValidationController) {
      // Validate date for morteOcorreu field block
      this.morteOcorreuFieldBlock();
    }
  }

  sexoHandler(): void {
    if (!this.morteOcorreuValidationController) {
      // Validate date for morteOcorreu field block
      this.morteOcorreuFieldBlock();
    }
  }

  // Validate inputs for morteOcorreu field block
  morteOcorreuFieldBlock(): void {
      let calculatedAge;
      if (this.coNormalForm.get('dataNascimento').value) {

        // Calculate birth date using MomentJS's "diff" function
        if (this.coNormalForm.get('dataObito').value) {
          calculatedAge = moment(this.coNormalForm.get('dataObito').value).diff(this.coNormalForm.get('dataNascimento').value, 'years');
        } else {
          calculatedAge = moment(this.dataEmissaoAux).diff(this.coNormalForm.get('dataNascimento').value, 'years');
        }
      }

      if (this.coNormalForm.get('sexo').value === '2' && calculatedAge >= 10 && calculatedAge <= 54) {
        this.mandatoryFieldMorteOcorreu = true;
      } else {
        this.mandatoryFieldMorteOcorreu = false;
      }

      if (this.coNormalForm.get('sexo').value === '1' || this.coNormalForm.get('sexo').value === '3' || calculatedAge >= 55 || calculatedAge < 10) {
        this.tpMorteMulherLabel = '<Escolher>';
        this.coNormalForm.patchValue({ morteOcorreu: null });
        this.blockFieldMorteOcorreu = true;
      } else {
        this.blockFieldMorteOcorreu = false;
      }
  }

  // Validate inputs from baseCausaMorte field
  camposAutopsiaFieldBlock(): void {
    if (this.initialData.numProcessoAutopsiaViaRegistoAutopsia) {
      this.coNormalForm.patchValue({ numProcessoAutopsia: this.initialData.numProcessoAutopsiaViaRegistoAutopsia });
      this.blockFieldNumProcessoAutopsia = true;
    } else {
      this.blockFieldNumProcessoAutopsia = false;
    }

    if (this.initialData.dataAutopsiaViaRegistoAutopsia) {
      this.coNormalForm.patchValue({ dataAutopsia:
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
      this.coNormalForm.patchValue({ horaAutopsia: this.initialData.horaAutopsiaViaRegistoAutopsia });
      this.blockFieldHoraAutopsia = true;
    } else {
      this.blockFieldHoraAutopsia = false;
    }
  }

  // Clean the residencia input from the form
  cleanMorada(): void {
    if (this.coNormalForm.get('chkMoradaRDesconhecida').value) {
      this.coNormalForm.patchValue({ residencia: '' });
    }
  }

  // Clean the input from the form
  cleanValuesInumacaoCremacao(): void {
    this.coNormalForm.patchValue({ motivoInumacaoCremacao: '' });
  }

  /**
   * Validates if BI and/or NIC values are empty.
   */
  onValidateBiNicFields({ value }: { value: CertificadoObitoNormal }) {
    if (!this.coNormalForm.get('numBI').value && !this.coNormalForm.get('numUtente').value) {
      this.dynamicConfirmAlertsMessages(this.numBIAndNumUtenteAlertLabel, 'numBI', value);
    } else if (this.coNormalForm.get('numBI').value && !this.coNormalForm.get('numUtente').value) {
      this.dynamicConfirmAlertsMessages(this.numUtenteAlertLabel, 'numUtente', value);
    } else if (!this.coNormalForm.get('numBI').value && this.coNormalForm.get('numUtente').value) {
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
  async dynamicConfirmAlertsMessages(dynamicMessage: any, elementName: string, value: CertificadoObitoNormal) {
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
  onSubmitForm({ value }: { value: CertificadoObitoNormal }): void {
    // Create loading
    this.msicoLoading.onLoading();

    event.preventDefault();

    let listVerify: any;
    this.formParsed = value;

    // Clean Alert and Errors List from SNS and BI
    this.listErrorsBICValidation = null;
    this.listAlertsBICValidation = null;

    this.listAlertsBISNSValidation = null;
    this.listErrorsBISNSValidation = null;

    this.showCheckIconBIC = false;
    this.showCheckMarkIcon = false;

    this.showCloseIcon = false;
    this.showCloseIconBIC = false;

    /*Delete the dataNascimento,dataObito and localObitoInstSaude fields from the Object,
      because the server will not accept with the values that contains*/
    delete value.dataNascimento;
    delete value.dataObito;
    delete value.localObitoInstSaude;

    /*If the dataNascimento is not null then,split the value into three different values
   *the server is expecting three different values which is year, month an day separately*/
    value.nascimentoAno = this.dataNascimentoAnoAux;
    value.nascimentoMes = this.dataNascimentoMesAux;
    value.nascimentoDia = this.dataNascimentoDiaAux;

    /*If the dataObito is not null then,split the value into three different values
    *the server is expecting three different values which is year, month an day separately*/
    value.obitoAno = this.obitoAnoAux;
    value.obitoMes = this.obitoMesAux;
    value.obitoDia = this.obitoDiaAux;

    /*If the dataAutopsia is not null then split the value
    into and create an string with the three values to submit*/
    if (this.coNormalForm.get('dataAutopsia').value) {
      let dataAutopsiaSplited = this.coNormalForm
        .get('dataAutopsia')
        .value.split('-');

      value.dataAutopsia =
        dataAutopsiaSplited[2] +
        '-' +
        dataAutopsiaSplited[1] +
        '-' +
        dataAutopsiaSplited[0];
    }

    // Default values on submit
    value.dataEmissao = this.initialData.dataEmissao;
    value.horaEmissao = this.initialData.horaEmissao;
    value.nomeClinico = this.initialData.nomeClinico;
    value.numCedulaProfissional = this.initialData.numCedulaProfissional;
    value.codigoInmlProfissional = this.coNormalForm.get(
      'codigoInmlProfissional'
    ).value;

    // If the numBI is not null then remove leading zeros
    if (this.coNormalForm.get('numBI').value) {
      value.numBI = parseInt(value.numBI.toString(), 10);
      let newValueNumBI = value.numBI.toString().replace(/^0+/, '');
      this.coNormalForm.patchValue({ numBI: newValueNumBI });
    }

    // Call the webservices to validation
    this.msicoWebServices.verifyCO(value, 'altera').subscribe(
      data => {
        listVerify = data;
        let element: any;

        if (this.coNormalForm.get('coVersaoAnteriorComNuipc').value === false) {
          if (this.coNormalForm.get('bicComNuipc').value === true) {
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

        // While there is elements with class 'alertValidationItem' clear out
        while (this.elementsAlerts.length) {
          this.elementsAlerts[0].className = this.elementsAlerts[0].className.replace(
            /\balertValidationItem\b/g,
            ''
          );
        }

        // Disappear loading
        this.msicoLoading.onLoadingRemove();

        // If the result is 2 then there is some errors
        if (listVerify.resultadoOutput === '2') {
          this.errorsOnValidation = true;
          this.alertsOnValidation = false;
          this.showSubmitMessage = false;
          this.scrollToTop();

          this.identFale = true;
          this.obito = true;
          this.causasMorte = true;
          this.medico = true;
          this.ministerioPublico = true;

          // List of errors to be displayed
          this.listErrorsValidation = listVerify.dadosOutput.listaErrosComCampo;

          this.paintErrors(this.listErrorsValidation);
        } else if (listVerify.resultadoOutput === '0') {
          // If the result is 0 then sucess on the submission
          this.errorsOnValidation = false;
          this.alertsOnValidation = false;
          this.showSubmitMessage = true;
          this.controlDisable = true;
          this.controlFieldsFromNUIPC = true;
          this.controlFieldsDispensaAndNuipc = true;
          this.saveCheck = false;
          this.showCheckMarkIcon = false;
          this.showCloseIcon = false;
        } else if (listVerify.resultadoOutput === '1') {
          // If the result is 1 then there is some alerts
          this.errorsOnValidation = false;
          this.showSubmitMessage = true;
          this.alertsOnValidation = true;
          this.controlDisable = true;
          this.controlFieldsFromNUIPC = true;
          this.controlFieldsDispensaAndNuipc = true;
          this.saveCheck = true;
          this.scrollToTop();
          this.showCheckMarkIcon = false;
          this.showCloseIcon = false;

          // Open Sections
          this.identFale = true;
          this.obito = true;
          this.causasMorte = true;
          this.medico = true;
          this.ministerioPublico = true;

          // List of alerts to be displayed
          this.listAlertsValidation =
            listVerify.dadosOutput.listaAlertasComCampo;

          this.paintAlerts(this.listAlertsValidation);
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
    // While there is elements with class 'balertValidationItem' clear out
    while (this.elementsAlerts.length) {
      this.elementsAlerts[0].className = this.elementsAlerts[0].className.replace(
        /\balertValidationItem\b/g,
        ''
      );
    }

    // Create loading
    this.msicoLoading.onLoading();

    let listVerify: any;
    let element: any;

    // Call the webservice submitSucess to send the final data to the server
    this.msicoWebServices
      .submitSucessCONormal(this.formParsed, 'altera')
      .subscribe(
        data => {
          let dataRetrieved: any = data;

          // If the result is 2 then
          if (dataRetrieved.resultadoOutput === '2') {
            this.errorsOnValidation = true;
            this.alertsOnValidation = false;
            this.showSubmitMessage = false;
            this.controlDisable = false;
            this.saveCheck = false;
            this.scrollToTop();

            // List of errors to be displayed
            this.listErrorsValidation =
              dataRetrieved.dadosOutput.listaErrosComCampo;

            this.paintErrors(this.listErrorsValidation);

            // Loading Remove
            this.msicoLoading.onLoadingRemove();
          }

          if (dataRetrieved.resultadoOutput === '0') {
            this.msicoLoading.onLoadingRemove();

            this.coNormalForm.patchValue({
              idCO: dataRetrieved.dadosOutput.idCO
            });

            this.coNormalForm.patchValue({
              numCertificado: dataRetrieved.dadosOutput.numCertificado
            });

            this.numCONormalForSucess =
              dataRetrieved.dadosOutput.numCertificado;

            this.navCtrl.navigateForward('sucessoCONormal', {
              state: {
                idCO: dataRetrieved.dadosOutput.idCO,
                numCONormalForSucess: this.numCONormalForSucess,
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

  // By cancel during the validation process
  onCancel(): void {
    this.saveCheck = false;
    this.alertsOnValidation = false;
    this.showSubmitMessage = false;
    this.controlDisable = false;
    //this.content.scrollToTop();

    if (this.coNormalForm.get('coVersaoAnteriorComNuipc').value === false) {
      if (this.coNormalForm.get('bicComNuipc').value) {
        this.controlFieldsDispensaAndNuipc = true;
      } else {
        this.controlFieldsDispensaAndNuipc = false;
      }
    }
  }

  paisNaturalidadeHandler(): void {
    if (this.coNormalForm.get('paisNaturalidade').value !== 'PT') {
      this.blockFieldsNaturalidade = true;

      // Clean Distrito, Concelho, Freguesia
      this.coNormalForm.patchValue({ distritoNaturalidade: '' });
      this.coNormalForm.patchValue({ concelhoNaturalidade: '' });
      this.coNormalForm.patchValue({ freguesiaNaturalidade: '' });

      // Clean the List of Concelho and Freguesia
      this.naturalidadeConcelhoList = [];
      this.naturalidadeFreguesiaList = [];
    } else {
      this.blockFieldsNaturalidade = false;
    }
  }

  paisResidenciaHandler(e?: any): void {
    if (this.coNormalForm.get('paisResidencia').value !== 'PT') {
      this.blockFieldsResidencia = true;

      // Clean first the previous values
      this.coNormalForm.patchValue({ distritoResidencia: '' });
      this.coNormalForm.patchValue({ concelhoResidencia: '' });
      this.coNormalForm.patchValue({ freguesiaResidencia: '' });

      // Clean first Concelho and Freguesia List
      this.residenciaConcelhoList = [];
      this.residenciaFreguesiaList = [];

      // Desconhecidos
      this.coNormalForm.patchValue({
        chkDistritoRDesconhecida: this.blockFieldsResidencia
      });
      this.coNormalForm.patchValue({
        chkConcelhoRDesconhecida: this.blockFieldsResidencia
      });
      this.coNormalForm.patchValue({
        chkFreguesiaRDesconhecida: this.blockFieldsResidencia
      });

      // Block the Desconhecidos
      this.blockDistritoDesconhecido = this.coNormalForm.get(
        'chkPaisRDesconhecida'
      ).value;
      this.blockConcelhoDesconhecido = this.coNormalForm.get(
        'chkPaisRDesconhecida'
      ).value;
      this.blockFreguesiaDesconhecido = this.coNormalForm.get(
        'chkPaisRDesconhecida'
      ).value;
    }

    if (this.coNormalForm.get('paisResidencia').value === 'PT') {
      this.blockFieldsResidencia = false;

      // Desconhecidos
      this.coNormalForm.patchValue({
        chkDistritoRDesconhecida: this.blockFieldsResidencia
      });
      this.coNormalForm.patchValue({
        chkConcelhoRDesconhecida: this.blockFieldsResidencia
      });
      this.coNormalForm.patchValue({
        chkFreguesiaRDesconhecida: this.blockFieldsResidencia
      });
    }

    // Block the Desconhecidos
    this.blockDistritoDesconhecido = this.blockFieldsResidencia;
    this.blockConcelhoDesconhecido = this.blockFieldsResidencia;
    this.blockFreguesiaDesconhecido = this.blockFieldsResidencia;
  }

  eventPrevendDefault(event: Event) {
    event.preventDefault();
  }

  paisLocalObitoHandler(hasClicked: boolean): void {
    if (hasClicked) {
      if (this.coNormalForm.get('paisLocalObito').value !== 'PT') {
        this.blockFieldLocalObito = true;
        this.coNormalForm.patchValue({ distritoLocalObito: '' });
        this.coNormalForm.patchValue({ concelhoLocalObito: '' });
        this.coNormalForm.patchValue({ freguesiaLocalObito: '' });

        // Concelho - Local Obito
        this.localObitoConcelhoList = this.initialList;

        // Freguesia - Local Obito
        this.localObitoFreguesiaList = this.initialList;

        this.coNormalForm.patchValue({ chkDistritoLDesconhecida: true });
        this.coNormalForm.patchValue({ chkConcelhoLDesconhecida: true });
        this.coNormalForm.patchValue({ chkFreguesiaLDesconhecida: true });
      }

      if (this.coNormalForm.get('paisLocalObito').value === 'PT') {
        this.blockFieldLocalObito = false;
        this.coNormalForm.patchValue({ chkDistritoLDesconhecida: false });
        this.coNormalForm.patchValue({ chkConcelhoLDesconhecida: false });
        this.coNormalForm.patchValue({ chkFreguesiaLDesconhecida: false });
      }
    }
  }

  onResidenciaCheckDesconhecido(value: any): void {
    if (value === 'chkPaisRDesconhecida') {
      this.desconhecidoPais = !this.desconhecidoPais;
      this.coNormalForm.patchValue({ paisResidencia: null });

      if (!this.coNormalForm.get('chkPaisRDesconhecida').value) {
        // Clean all data from the selection box

        this.coNormalForm.patchValue({ paisResidencia: 'PT' });

        this.coNormalForm.patchValue({ distritoResidencia: '' });
        this.coNormalForm.patchValue({ concelhoResidencia: '' });
        this.coNormalForm.patchValue({ freguesiaResidencia: '' });

        this.residenciaConcelhoList = [];
        this.residenciaFreguesiaList = [];

        this.coNormalForm.patchValue({
          chkDistritoRDesconhecida: this.coNormalForm.get(
            'chkPaisRDesconhecida'
          ).value
        });
        this.coNormalForm.patchValue({
          chkConcelhoRDesconhecida: this.coNormalForm.get(
            'chkPaisRDesconhecida'
          ).value
        });
        this.coNormalForm.patchValue({
          chkFreguesiaRDesconhecida: this.coNormalForm.get(
            'chkPaisRDesconhecida'
          ).value
        });
      } else {
        // Clean all data from the selection box
        this.coNormalForm.patchValue({ paisResidencia: '' });
        this.coNormalForm.patchValue({
          chkDistritoRDesconhecida: this.coNormalForm.get(
            'chkPaisRDesconhecida'
          ).value
        });
        this.coNormalForm.patchValue({
          chkConcelhoRDesconhecida: this.coNormalForm.get(
            'chkPaisRDesconhecida'
          ).value
        });
        this.coNormalForm.patchValue({
          chkFreguesiaRDesconhecida: this.coNormalForm.get(
            'chkPaisRDesconhecida'
          ).value
        });
      }
    }

    if (value === 'chkDistritoRDesconhecida') {
      this.coNormalForm.patchValue({ distritoResidencia: '' });
      this.coNormalForm.patchValue({ concelhoResidencia: '' });
      this.coNormalForm.patchValue({ freguesiaResidencia: '' });

      this.coNormalForm.patchValue({
        chkConcelhoRDesconhecida: this.coNormalForm.controls[
          'chkDistritoRDesconhecida'
        ].value
      });
      this.coNormalForm.patchValue({
        chkFreguesiaRDesconhecida: this.coNormalForm.controls[
          'chkDistritoRDesconhecida'
        ].value
      });

      // Clean Concelho and Freguesia List
      this.residenciaConcelhoList = [];
      this.residenciaFreguesiaList = [];
    }

    if (value === 'chkConcelhoRDesconhecida') {
      // Clean all data from the selection box
      this.desconhecidoConcelho !== this.desconhecidoConcelho;

      this.coNormalForm.patchValue({ concelhoResidencia: '' });
      this.coNormalForm.patchValue({ freguesiaResidencia: '' });
      this.coNormalForm.patchValue({
        chkFreguesiaRDesconhecida: this.coNormalForm.controls[
          'chkConcelhoRDesconhecida'
        ].value
      });

      // Clean Freguesia List
      this.residenciaFreguesiaList = [];
    }

    if (value === 'chkFreguesiaRDesconhecida') {
      // Clean all data from the selection box
      this.coNormalForm.patchValue({ freguesiaResidencia: '' });
    }
  }

  onLocalObitoCheckDesconhecido(value: any): void {
    // Check Distrito Desconhecida
    if (value === 'chkDistritoLDesconhecida') {
      this.desconhecidoPaisOutroLocal = !this.desconhecidoPaisOutroLocal;

      this.coNormalForm.patchValue({ distritoLocalObito: '' });
      this.coNormalForm.patchValue({ concelhoLocalObito: '' });
      this.coNormalForm.patchValue({ freguesiaLocalObito: '' });

      this.localObitoConcelhoList = this.initialList;
      this.localObitoFreguesiaList = this.initialList;

      this.coNormalForm.patchValue({
        chkConcelhoLDesconhecida: this.coNormalForm.get(
          'chkDistritoLDesconhecida'
        ).value
      });
      this.coNormalForm.patchValue({
        chkFreguesiaLDesconhecida: this.coNormalForm.get(
          'chkDistritoLDesconhecida'
        ).value
      });
    }

    if (value === 'chkConcelhoLDesconhecida') {
      this.desconhecidoConcelhoOutroLocal = !this
        .desconhecidoConcelhoOutroLocal;

      this.localObitoFreguesiaList = this.initialList;

      this.coNormalForm.patchValue({ concelhoLocalObito: '' });
      this.coNormalForm.patchValue({ freguesiaLocalObito: '' });
      this.coNormalForm.patchValue({
        chkFreguesiaLDesconhecida: this.coNormalForm.get(
          'chkConcelhoLDesconhecida'
        ).value
      });
    }

    if (value === 'chkFreguesiaLDesconhecida') {
      this.coNormalForm.patchValue({ freguesiaLocalObito: '' });
    }
  }

  populateConcelhoNaturalidadeList(dataValue?: any) {
    this.coNormalForm.patchValue({ concelhoNaturalidade: '' });
    this.coNormalForm.patchValue({ freguesiaNaturalidade: '' });

    this.naturalidadeConcelhoList = this.initialList;
    this.naturalidadeFreguesiaList = this.initialList;

    if (!this.searchByBIC && !this.searchBySNSOrBI) {
      // Call the webservices to get the specific list
      this.msicoWebServices
        .getListSpecificNaturalidadeDistritoServices(
          this.coNormalForm.get('distritoNaturalidade').value,
          this.dataNascimentoAnoAux,
          this.dataNascimentoMesAux,
          this.dataNascimentoDiaAux,
          this.dataEmissaoAuxAno,
          this.dataEmissaoAuxMes,
          this.dataEmissaoAuxDia
        )
        .subscribe(
          data => {
            let dataRetrieved: any = data;

            if (dataRetrieved.dadosOutput) {
              this.naturalidadeConcelhoList =
                dataRetrieved.dadosOutput.naturalidadeConcelho;
              if (dataValue !== undefined) {
                this.coNormalForm.patchValue({
                  concelhoNaturalidade: dataValue
                });
              }
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

  populateFreguesiaNaturalidadeList(): void {
    this.coNormalForm.patchValue({ freguesiaNaturalidade: '' });

    if (!this.searchByBIC && !this.searchBySNSOrBI) {
      // Call the webservices to get the specific list
      this.msicoWebServices
        .getListSpecificNaturalidadeFreguesiaServices(
          this.dataNascimentoAnoAux,
          this.dataNascimentoMesAux,
          this.dataNascimentoDiaAux,
          this.dataEmissaoAuxAno,
          this.dataEmissaoAuxMes,
          this.dataEmissaoAuxDia,
          this.coNormalForm.get('distritoNaturalidade').value,
          this.coNormalForm.get('concelhoNaturalidade').value
        )
        .subscribe(
          data => {
            let dataRetrieved: any = data;

            if (dataRetrieved.dadosOutput) {
              this.naturalidadeFreguesiaList =
                dataRetrieved.dadosOutput.naturalidadeFreguesia;
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

  populateConcelhoResidenciaList(): void {
    this.coNormalForm.patchValue({ concelhoResidencia: '' });
    this.coNormalForm.patchValue({ freguesiaResidencia: '' });

    // Clean List Residencia
    this.residenciaConcelhoList = this.initialList;
    this.residenciaFreguesiaList = this.initialList;

    if (!this.searchBySNSOrBI) {
      // Call the webservices to get the specific list
      this.msicoWebServices
        .getListSpecificResidenciaConcelhoServices(
          this.obitoAnoAux,
          this.obitoMesAux,
          this.obitoDiaAux,
          this.dataEmissaoAuxAno,
          this.dataEmissaoAuxMes,
          this.dataEmissaoAuxDia,
          this.coNormalForm.get('distritoResidencia').value
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
  }

  populateFreguesiaResidenciaList(): void {
    this.coNormalForm.patchValue({ freguesiaResidencia: '' });

    if (!this.searchBySNSOrBI) {
      // Call the webservices to get the specific list
      this.msicoWebServices
        .getListSpecificResidenciaFreguesiaServices(
          this.obitoAnoAux,
          this.obitoMesAux,
          this.obitoDiaAux,
          this.dataEmissaoAuxAno,
          this.dataEmissaoAuxMes,
          this.dataEmissaoAuxDia,
          this.coNormalForm.get('distritoResidencia').value,
          this.coNormalForm.get('concelhoResidencia').value
        )
        .subscribe(
          data => {
            let dataRetrieved: any = data;
            if (dataRetrieved.dadosOutput) {
              this.residenciaFreguesiaList =
                dataRetrieved.dadosOutput.residenciaFreguesia;
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

  populateLocalObitoConcelhoList(hasClicked: boolean): void {
    if (hasClicked) {
      this.coNormalForm.patchValue({ concelhoLocalObito: '' });
      this.coNormalForm.patchValue({ freguesiaLocalObito: '' });

      this.localObitoConcelhoList = this.initialList;
      this.localObitoFreguesiaList = this.initialList;
    }
    // Call the webservices to get the specific list
    this.msicoWebServices
      .getListSpecificLocalObitoConcelhoServices(
        this.obitoAnoAux,
        this.obitoMesAux,
        this.obitoDiaAux,
        this.dataEmissaoAuxAno,
        this.dataEmissaoAuxMes,
        this.dataEmissaoAuxDia,
        this.coNormalForm.get('distritoLocalObito').value
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

  populateLocalObitoFreguesiaList(hasClicked: boolean): void {
    if (hasClicked) {
      this.coNormalForm.patchValue({ freguesiaLocalObito: '' });
      this.localObitoFreguesiaList = this.initialList;
    }
    // Call the webservices to get the specific list
    this.msicoWebServices
      .getListSpecificLocalObitoFreguesiaServices(
        this.obitoAnoAux,
        this.obitoMesAux,
        this.obitoDiaAux,
        this.dataEmissaoAuxAno,
        this.dataEmissaoAuxMes,
        this.dataEmissaoAuxDia,
        this.coNormalForm.get('distritoLocalObito').value,
        this.coNormalForm.get('concelhoLocalObito').value
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

  populateInstSaudeList(): void {
    this.listHospistais = [];
    this.instituicaoSaudeObitoLabel = '<Escolher>';
    this.coNormalForm.patchValue({ idHospitaisObito: '' });
    this.coNormalForm.patchValue({ idUACObito: '' });
    this.coNormalForm.patchValue({ idOutroObito: '' });
    this.listHospistais = [
      this.list.listHospitais,
      this.list.listUAC,
      this.list.listOutrosMed
    ];

    this.coNormalForm.patchValue({ idServicoObito: '' });

    let selectEntidadeObito: number = this.coNormalForm.get(
      'selectEntidadeObito'
    ).value;

    this.instSaudeList = this.listHospistais[selectEntidadeObito - 1];
  }

  // Clean current inputs from the form
  clearTipoEntidadeMedico(): void {
    this.coNormalForm.patchValue({ selectEntidade: '' });
    this.coNormalForm.patchValue({
      instituicaoSaudeMoradaProfissionalLabel: '<Escolher>'
    });
    this.coNormalForm.patchValue({ codigoSaudeProfissional: '' });
    this.coNormalForm.patchValue({ codigoSaudeProfissionalServico: '' });
    this.servicoLabel = '<Escolher>';

    // Morada Profissional
    this.coNormalForm.patchValue({ moradaProfissional: '' });
    this.coNormalForm.patchValue({ codigoInmlProfissional: '' });
    this.instituicaoMoradaProLabel = '<Escolher>';
  }

  // Clean current inputs from the form
  clearDataNascimento(): void {
    if (this.coNormalForm.controls['chkNascDesconhecida'].value && this.coNormalForm.get('dataNascimento').value) {
      this.dataNascimentoAnoAux = '';
      this.dataNascimentoMesAux = '';
      this.dataNascimentoDiaAux = '';

      // Method to force call dataNascimentoHandler for the first time clicking the checkbox
      if (this.dataNascimentoChkController !== 1) {
        this.dataNascimentoChkController = 1;
        this.coNormalForm.patchValue({ dataNascimento: '' });
        this.dataNascimentoHandler();
      } else {
        this.coNormalForm.patchValue({ dataNascimento: '' });
      }
    }
  }

  // Clean current inputs from the form
  clearDataObito(): void {
    if (this.coNormalForm.controls['chkObitoDesconhecida'].value && this.coNormalForm.get('dataObito').value) {
      this.obitoAnoAux = '';
      this.obitoMesAux = '';
      this.obitoDiaAux = '';

      // Method to force call dataObitoHandler for the first time clicking the checkbox
      if (this.dataObitoChkController !== 1) {
        this.dataObitoChkController = 1;
        this.coNormalForm.patchValue({ dataObito: '' });
        this.dataObitoHandler();
      } else {
        this.coNormalForm.patchValue({ dataObito: '' });
      }
    }
  }

  // Clean current inputs from the form
  clearHoraObito(): void {
    this.coNormalForm.patchValue({ horaObito: '' });
  }

  // Populate Instituição de Saude on Medico field
  populateMedicoInstSaudeList(): void {
    // Clear data before
    this.coNormalForm.patchValue({ codigoSaudeProfissionalServico: '' });
    this.servicoLabel = '<Escolher>';
    this.coNormalForm.patchValue({ moradaProfissionalServicoOutro: '' });

    // Instituição which has the label to be represent on the form and the data to be sent to the server
    this.instituicaoSaudeMoradaProfissionalLabel = '<Escolher>';

    // Instituição de saúde which has the label to be represent on the form and the data to be sent to the server
    this.coNormalForm.patchValue({ codigoInmlProfissional: '' });
    this.coNormalForm.patchValue({ codigoSaudeProfissional: '' });

    this.listMedicoInstSaude = [
      this.list.listHospitaisMed,
      this.list.listUACMed,
      this.list.listOutrosMed
    ];

    let selectEntidade: number = this.coNormalForm.get('selectEntidade').value;

    this.medicoInstSaudeList = this.listMedicoInstSaude[selectEntidade - 1];
  }

  // Pass automatically the default country to PT (Portugal)
  defaultCountry(): void {
    if (
      this.coNormalForm.get('localObito').value ||
      this.coNormalForm.get('localObito').value
    ) {
      this.coNormalForm.patchValue({ paisLocalObito: 'PT' });
    }
  }

  // Get data from the server based on the number of SNS and BI
  getDataFalecidoCONormalHandler(): void {
    this.msicoLoading.onLoadingRemove();

    // Create Loading
    this.msicoLoading.onLoading();

    this.showCloseIcon = false;
    this.showCheckMarkIcon = false;

    this.showCheckIconBIC = false;
    this.showCloseIconBIC = false;

    this.cleanDataFromUtenteOrNIC();

    if (this.coNormalForm.get('dataNascimento').value) {
      // Create an parse to the data nascimento
      this.coNormalForm.patchValue({
        dataNascimento: null
      });
    }

    this.dataNascimentoAnoAux = '';
    this.dataNascimentoMesAux = '';
    this.dataNascimentoDiaAux = '';

    this.coNormalForm.patchValue({
      chkNascDesconhecida: false
    });

    this.coNormalForm.patchValue({
      nacionalidade: '<Escolher>'
    });

    this.coNormalForm.patchValue({
      residencia: ''
    });

    // Call the webservice getDataBicCONormal to retrieve the data
    this.msicoWebServices
      .getDataFalecidoCONormal(
        this.coNormalForm.get('numUtente').value,
        this.coNormalForm.get('numBI').value,
        this.obitoAnoAux,
        this.obitoMesAux,
        this.obitoDiaAux,
        this.dataEmissaoAuxAno,
        this.dataEmissaoAuxMes,
        this.dataEmissaoAuxDia
      )
      .subscribe(
        data => {
          let dataRetrieved: any = data;

          this.searchBySNSOrBI = true;

          this.morteOcorreuValidationController = true;
          // Insert automatically values from the server to the form
          this.coNormalForm.patchValue({
            nomeFalecido: dataRetrieved.dadosOutput.nomeFalecido
          });
          this.coNormalForm.patchValue({
            nomePai: dataRetrieved.dadosOutput.nomePai
          });
          this.coNormalForm.patchValue({
            nomeMae: dataRetrieved.dadosOutput.nomeMae
          });
          this.coNormalForm.patchValue({
            sexo: dataRetrieved.dadosOutput.sexo
          });

          this.coNormalForm.patchValue({
            chkNascDesconhecida: dataRetrieved.dadosOutput.chkNascDesconhecida
          });

          // Create an parse to the data nascimento
          if (
            dataRetrieved.dadosOutput.nascimentoAno &&
            dataRetrieved.dadosOutput.nascimentoMes &&
            dataRetrieved.dadosOutput.nascimentoDia
          ) {
            this.coNormalForm.patchValue({
              dataNascimento:
                dataRetrieved.dadosOutput.nascimentoAno +
                '-' +
                this.pad(dataRetrieved.dadosOutput.nascimentoMes, 2, 0) +
                '-' +
                this.pad(dataRetrieved.dadosOutput.nascimentoDia, 2, 0)
            });
          }

          this.dataNascimentoAnoAux = dataRetrieved.dadosOutput.nascimentoAno;
          this.dataNascimentoMesAux = dataRetrieved.dadosOutput.nascimentoMes;
          this.dataNascimentoDiaAux = dataRetrieved.dadosOutput.nascimentoDia;

          this.coNormalForm.patchValue({
            nascimentoAno: dataRetrieved.dadosOutput.nascimentoAno
          });
          this.coNormalForm.patchValue({
            nascimentoMes: dataRetrieved.dadosOutput.nascimentoMes
          });
          this.coNormalForm.patchValue({
            nascimentoDia: dataRetrieved.dadosOutput.nascimentoDia
          });

          // Nacionalidade
          this.coNormalForm.patchValue({
            nacionalidade: dataRetrieved.dadosOutput.nacionalidade
          });

          // Residencia
          this.coNormalForm.patchValue({
            residencia: dataRetrieved.dadosOutput.residencia
          });

          // Residencia Check Desconhecido
          this.coNormalForm.patchValue({
            chkMoradaRDesconhecida:
              dataRetrieved.dadosOutput.chkMoradaRDesconhecida
          });

          // Residencia Pais Desconhecido
          this.coNormalForm.patchValue({
            chkPaisRDesconhecida: dataRetrieved.dadosOutput.chkPaisRDesconhecida
          });

          // Residencia Distrito Desconhecido
          this.coNormalForm.patchValue({
            chkDistritoRDesconhecida:
              dataRetrieved.dadosOutput.chkDistritoRDesconhecida
          });

          // Residencia Concelho Desconhecido
          this.coNormalForm.patchValue({
            chkConcelhoRDesconhecida:
              dataRetrieved.dadosOutput.chkConcelhoRDesconhecida
          });

          // Residencia Freguesia Desconhecido
          this.coNormalForm.patchValue({
            chkFreguesiaRDesconhecida:
              dataRetrieved.dadosOutput.chkFreguesiaRDesconhecida
          });

          // List Pais Naturalidade
          this.naturalidadePaisList =
            dataRetrieved.dadosOutput.naturalidadePais;

          // Naturalidade
          this.coNormalForm.patchValue({
            paisNaturalidade: dataRetrieved.dadosOutput.paisNaturalidade
          });

          this.naturalidadeDistritoList =
            dataRetrieved.dadosOutput.naturalidadeDistrito;

          this.coNormalForm.patchValue({
            distritoNaturalidade: dataRetrieved.dadosOutput.distritoNaturalidade
          });

          this.naturalidadeConcelhoList =
            dataRetrieved.dadosOutput.naturalidadeConcelho;

          this.coNormalForm.patchValue({
            concelhoNaturalidade: dataRetrieved.dadosOutput.concelhoNaturalidade
          });

          this.naturalidadeFreguesiaList =
            dataRetrieved.dadosOutput.naturalidadeFreguesia;

          this.coNormalForm.patchValue({
            freguesiaNaturalidade:
              dataRetrieved.dadosOutput.freguesiaNaturalidade
          });

          this.residenciaPaisList = dataRetrieved.dadosOutput.listaPaises;

          // Morada Residencia
          this.coNormalForm.patchValue({
            residencia: dataRetrieved.dadosOutput.residencia
          });

          // Pais Residencia
          this.coNormalForm.patchValue({
            paisResidencia: dataRetrieved.dadosOutput.paisResidencia
          });

          this.residenciaDistritoList =
            dataRetrieved.dadosOutput.residenciaDistrito;

          // Distrito Residencia
          this.coNormalForm.patchValue({
            distritoResidencia: dataRetrieved.dadosOutput.distritoResidencia
          });

          this.residenciaConcelhoList =
            dataRetrieved.dadosOutput.residenciaConcelho;

          // Concelho Residencia
          this.coNormalForm.patchValue({
            concelhoResidencia: dataRetrieved.dadosOutput.concelhoResidencia
          });

          this.residenciaFreguesiaList =
            dataRetrieved.dadosOutput.residenciaFreguesia;

          this.coNormalForm.patchValue({
            freguesiaResidencia: dataRetrieved.dadosOutput.freguesiaResidencia
          });

          // Calling the Handlers
          this.paisNaturalidadeHandler();

          this.coNormalForm.patchValue({
            chkMoradaRDesconhecida:
              dataRetrieved.dadosOutput.chkMoradaRDesconhecida
          });
          this.coNormalForm.patchValue({
            chkPaisRDesconhecida: dataRetrieved.dadosOutput.chkPaisRDesconhecida
          });
          this.coNormalForm.patchValue({
            chkDistritoRDesconhecida:
              dataRetrieved.dadosOutput.chkDistritoRDesconhecida
          });
          this.coNormalForm.patchValue({
            chkConcelhoRDesconhecida:
              dataRetrieved.dadosOutput.chkConcelhoRDesconhecida
          });
          this.coNormalForm.patchValue({
            chkFreguesiaRDesconhecida:
              dataRetrieved.dadosOutput.chkFreguesiaRDesconhecida
          });

          // If the results is 0 or 2 then (still in development)
          if (dataRetrieved.resultadoOutput === '0') {
            // Remove loading
            this.msicoLoading.onLoadingRemove();

            this.showCheckMarkIcon = true;
            this.showCloseIcon = false;

            this.searchBySNSOrBI = false;

            this.listAlertsBISNSValidation = null;
            this.listErrorsBISNSValidation = null;
          } else if (dataRetrieved.resultadoOutput === '2') {
            // Errors
            this.msicoLoading.onLoadingRemove();
            this.listErrorsBISNSValidation =
              dataRetrieved.dadosOutput.listaErrosComCampo;
            this.listAlertsBISNSValidation = null;

            this.paintErrors(this.listErrorsBISNSValidation);

            this.showCheckMarkIcon = false;
            this.showCloseIcon = true;

            this.searchBySNSOrBI = false;
          } else if (dataRetrieved.resultadoOutput === '1') {
            // Alerts
            this.msicoLoading.onLoadingRemove();
            this.showCloseIcon = true;
            this.showCheckMarkIcon = false;
            this.listAlertsBISNSValidation =
              dataRetrieved.dadosOutput.listaAlertasComCampo;
            this.listErrorsBISNSValidation = null;

            this.paintAlerts(this.listAlertsBISNSValidation);

            this.searchBySNSOrBI = false;
          } else {
            this.msicoLoading.onLoadingRemove();
            this.listAlertsBISNSValidation =
              dataRetrieved.dadosOutput.listaAlertasComCampo;
          }
          // Validate date for morteOcorreu field block
          this.morteOcorreuFieldBlock();
          this.morteOcorreuValidationController = false;
        },
        err => {
          if (err) {
            this.msicoLoading.onLoadingRemove();
            this.msicoAlerts.handlerError(err, this.navCtrl);
          }
        }
      );
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

    this.searchByBIC = true;

    this.morteOcorreuValidationController = true;
    // Call the webservice getDataBicCONormal to retrieve the data
    this.msicoWebServices
      .getDadosBicCONormal(
        this.coNormalForm.get('numBIC').value,
        this.dataNascimentoAnoAux,
        this.dataNascimentoMesAux,
        this.dataNascimentoDiaAux,
        this.obitoAnoAux,
        this.obitoMesAux,
        this.obitoDiaAux,
        this.dataEmissaoAuxAno,
        this.dataEmissaoAuxMes,
        this.dataEmissaoAuxDia,
        'altera',
        this.coNormalForm.get('idCO').value,
        this.coNormalForm.get('numCertificado').value
      )
      .subscribe(
        data => {
          let dataRetrieved: any = data;
          let element: any;

          if (
            this.coNormalForm.get('coVersaoAnteriorComNuipc').value === false
          ) {
            // If the old bicComNuipc is true
            if (this.coNormalForm.get('bicComNuipc').value === true) {
              // If bicComNuipc is true from server
              if (dataRetrieved.dadosOutput.bicComNuipc === true) {
                this.coNormalForm.patchValue({
                  dispensaAutopsia: dataRetrieved.dadosOutput.dispensaAutopsia
                });

                this.coNormalForm.patchValue({
                  nuipc: dataRetrieved.dadosOutput.nuipc
                });

                this.controlFieldsFromNUIPC = true;
                this.controlFieldsDispensaAndNuipc = true;
              } else {
                // If bicComNuipc is false from server
                this.coNormalForm.patchValue({
                  dispensaAutopsia: ''
                });

                this.coNormalForm.patchValue({
                  nuipc: ''
                });

                this.controlFieldsFromNUIPC = false;
                this.controlFieldsDispensaAndNuipc = false;
              }
              // If the old bicComNuipc is false
            } else {
              // If bicComNuipc is true from server
              if (dataRetrieved.dadosOutput.bicComNuipc) {
                this.coNormalForm.patchValue({
                  dispensaAutopsia: dataRetrieved.dadosOutput.dispensaAutopsia
                });

                this.coNormalForm.patchValue({
                  nuipc: dataRetrieved.dadosOutput.nuipc
                });

                this.controlFieldsFromNUIPC = true;
                this.controlFieldsDispensaAndNuipc = true;
              }
            }
          } else {
            if (dataRetrieved.dadosOutput.dispensaAutopsia !== null) {
              this.coNormalForm.patchValue({
                dispensaAutopsia: dataRetrieved.dadosOutput.dispensaAutopsia
              });
            }

            if (dataRetrieved.dadosOutput.nuipc !== null) {
              this.coNormalForm.patchValue({
                nuipc: dataRetrieved.dadosOutput.nuipc
              });
            }
          }

          this.coNormalForm.patchValue({
            bicComNuipc: dataRetrieved.dadosOutput.bicComNuipc
          });

          // Insert automatically values from the server to the form
          if (dataRetrieved.dadosOutput.numBI) {
            this.coNormalForm.patchValue({
              numBI: dataRetrieved.dadosOutput.numBI
            });
          }
          if (dataRetrieved.dadosOutput.numUtente) {
            this.coNormalForm.patchValue({
              numUtente: dataRetrieved.dadosOutput.numUtente
            });
          }
          if (dataRetrieved.dadosOutput.nomeFalecido) {
            this.coNormalForm.patchValue({
              nomeFalecido: dataRetrieved.dadosOutput.nomeFalecido
            });
          }
          if (dataRetrieved.dadosOutput.nomePai) {
            this.coNormalForm.patchValue({
              nomePai: dataRetrieved.dadosOutput.nomePai
            });
          }
          if (dataRetrieved.dadosOutput.nomeMae) {
            this.coNormalForm.patchValue({
              nomeMae: dataRetrieved.dadosOutput.nomeMae
            });
          }
          if (dataRetrieved.dadosOutput.sexo) {
            this.coNormalForm.patchValue({
              sexo: dataRetrieved.dadosOutput.sexo
            });
          }
          if (dataRetrieved.dadosOutput.estadoCivil) {
            this.coNormalForm.patchValue({
              estadoCivil: dataRetrieved.dadosOutput.estadoCivil
            });
          }

          if (dataRetrieved.dadosOutput.nacionalidade) {
            // List Naturalidade Pais
            this.nacionalidadeList = dataRetrieved.dadosOutput.listaPaises;

            this.coNormalForm.patchValue({
              nacionalidade: dataRetrieved.dadosOutput.nacionalidade
            });
          }

          this.coNormalForm.patchValue({
            chkProfissaoDesconhecida:
              dataRetrieved.dadosOutput.chkProfissaoDesconhecida
          });

          if (dataRetrieved.dadosOutput.profissao) {
            this.coNormalForm.patchValue({
              profissao: dataRetrieved.dadosOutput.profissao
            });
          }

          if (dataRetrieved.dadosOutput.paisNaturalidade) {
            // List Naturalidade Pais
            this.naturalidadePaisList =
              dataRetrieved.dadosOutput.naturalidadePais;

            this.coNormalForm.patchValue({
              paisNaturalidade: dataRetrieved.dadosOutput.paisNaturalidade
            });

            this.paisNaturalidadeHandler();
          }

          if (dataRetrieved.dadosOutput.distritoNaturalidade) {
            // List Naturalidade Distrito
            this.naturalidadeDistritoList =
              dataRetrieved.dadosOutput.naturalidadeDistrito;

            this.coNormalForm.patchValue({
              distritoNaturalidade:
                dataRetrieved.dadosOutput.distritoNaturalidade
            });

            // List Naturalidade Concelho
            this.naturalidadeConcelhoList =
              dataRetrieved.dadosOutput.naturalidadeConcelho;

            this.coNormalForm.patchValue({
              concelhoNaturalidade:
                dataRetrieved.dadosOutput.concelhoNaturalidade
            });

            // List Naturalidade Freguesia
            this.naturalidadeFreguesiaList =
              dataRetrieved.dadosOutput.naturalidadeFreguesia;

            this.coNormalForm.patchValue({
              freguesiaNaturalidade:
                dataRetrieved.dadosOutput.freguesiaNaturalidade
            });
          }

          // Create an parse to the data nascimento
          if (
            dataRetrieved.dadosOutput.nascimentoAno &&
            dataRetrieved.dadosOutput.nascimentoMes &&
            dataRetrieved.dadosOutput.nascimentoDia
          ) {
            this.coNormalForm.patchValue({
              dataNascimento:
                dataRetrieved.dadosOutput.nascimentoAno +
                '-' +
                this.pad(dataRetrieved.dadosOutput.nascimentoMes, 2, 0) +
                '-' +
                this.pad(dataRetrieved.dadosOutput.nascimentoDia, 2, 0)
            });
          }

          if (dataRetrieved.dadosOutput.chkNascDesconhecida) {
            this.coNormalForm.patchValue({
              chkNascDesconhecida: dataRetrieved.dadosOutput.chkNascDesconhecida
            });
          }

          this.dataNascimentoAnoAux = dataRetrieved.dadosOutput.nascimentoAno;
          this.dataNascimentoMesAux = dataRetrieved.dadosOutput.nascimentoMes;
          this.dataNascimentoDiaAux = dataRetrieved.dadosOutput.nascimentoDia;

          this.coNormalForm.patchValue({
            nascimentoAno: dataRetrieved.dadosOutput.nascimentoAno
          });
          this.coNormalForm.patchValue({
            nascimentoMes: dataRetrieved.dadosOutput.nascimentoMes
          });
          this.coNormalForm.patchValue({
            nascimentoDia: dataRetrieved.dadosOutput.nascimentoDia
          });

          // If the results are 0 or 2 then
          if (dataRetrieved.resultadoOutput === '0') {
            this.msicoLoading.onLoadingRemove();

            this.listErrorsBICValidation = null;
            this.listAlertsBICValidation = null;

            this.searchByBIC = false;

            this.showCheckIconBIC = true;
            this.showCloseIconBIC = false;

            // Errors
          } else if (dataRetrieved.resultadoOutput === '2') {
            this.msicoLoading.onLoadingRemove();
            this.showCloseIconBIC = true;
            this.showCheckIconBIC = false;

            this.listAlertsBICValidation = null;
            this.searchByBIC = false;

            this.listErrorsBICValidation =
              dataRetrieved.dadosOutput.listaErrosComCampo;

            this.identFale = true;
            this.ministerioPublico = true;

            this.paintErrors(this.listErrorsBICValidation);

            // Alerts
          } else if (dataRetrieved.resultadoOutput === '1') {
            this.msicoLoading.onLoadingRemove();
            this.showCloseIconBIC = false;
            this.showCheckIconBIC = true;

            this.searchByBIC = false;

            // Open Sections
            this.identFale = true;
            this.obito = true;
            this.causasMorte = true;
            this.medico = true;
            this.ministerioPublico = true;

            this.listErrorsBICValidation = null;

            this.listAlertsBICValidation =
              dataRetrieved.dadosOutput.listaAlertasComCampo;

            this.paintAlerts(dataRetrieved.dadosOutput.listaAlertasComCampo);
          } else {
            this.msicoLoading.onLoadingRemove();

            // Create an alert with error messages
            this.msicoAlerts.dynamicAlertsMessages(
              dataRetrieved.dadosOutput.listaErrosComCampo[0].mensagemErro
            );
          }
          // Validate date for morteOcorreu field block
          this.morteOcorreuFieldBlock();
          this.morteOcorreuValidationController = false;
        },
        err => {
          if (err) {
            this.msicoLoading.onLoadingRemove();
            this.msicoAlerts.handlerError(err, this.navCtrl);
          }
        }
      );
  }

  getCONormalFichaInemPdf64(): void {
    this.msicoLoading.onLoading();

    let numCodu = this.coNormalForm.get('numCodu').value;

    this.alertsOnInem = false;
    this.errorsOnInem = false;

    if (numCodu === null) {
      numCodu = null;
    }

    this.msicoWebServices.getCONormalFichaInemPdf64(numCodu).subscribe(
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

  tipoObitoDataFromServer(value: any) {
    // Tipo Obito which has the label to be represent on the form and the data to be sent to the server
    this.tipoObitoLabel = value.tipoObitoSelectedDesc;
    this.coNormalForm.patchValue({
      tipoObitoSelected: value.tipoObitoSelected
    });
    // this.coNormalForm.patchValue({ descOutroAcidente: '' });

    if (
      this.coNormalForm.get('tipoObitoSelected').value === '11' ||
      this.coNormalForm.get('tipoObitoSelected').value === '9'
    ) {
      this.blockCausaMorte = true;

      this.coNormalForm.patchValue({ outroCmA: '' });
      this.coNormalForm.patchValue({ tempoA: '' });
      this.coNormalForm.patchValue({ unidTempoA: '' });
      this.coNormalForm.patchValue({ outroCmB: '' });
      this.coNormalForm.patchValue({ tempoB: '' });
      this.coNormalForm.patchValue({ unidTempoB: '' });
      this.coNormalForm.patchValue({ outroCmC: '' });
      this.coNormalForm.patchValue({ tempoC: '' });
      this.coNormalForm.patchValue({ unidTempoC: '' });
      this.coNormalForm.patchValue({ outroCmD: '' });
      this.coNormalForm.patchValue({ tempoD: '' });
      this.coNormalForm.patchValue({ unidTempoD: '' });
      this.coNormalForm.patchValue({ outroCmOutros: '' });
      this.coNormalForm.patchValue({ tempoOutros: '' });
      this.coNormalForm.patchValue({ unidTempoOutros: '' });
    } else {
      this.blockCausaMorte = false;
    }
  }

  dateChangeFormat(value: any) {
    let list: string[];
    list = value.split('-');
    return list;
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

  cleanDataFromUtenteOrNIC() {
    // Clean previous data and the input fields
    this.coNormalForm.patchValue({
      nomeFalecido: ''
    });
    this.coNormalForm.patchValue({ nomePai: '' });
    this.coNormalForm.patchValue({ nomeMae: '' });
    this.coNormalForm.patchValue({ sexo: '' });

    // Naturalidade
    this.coNormalForm.patchValue({
      paisNaturalidade: ''
    });

    this.coNormalForm.patchValue({
      distritoNaturalidade: ''
    });

    this.coNormalForm.patchValue({
      concelhoNaturalidade: ''
    });

    this.coNormalForm.patchValue({
      freguesiaNaturalidade: ''
    });

    // Residencia
    this.coNormalForm.patchValue({
      paisResidencia: ''
    });

    this.coNormalForm.patchValue({
      distritoResidencia: ''
    });

    this.coNormalForm.patchValue({
      concelhoResidencia: ''
    });

    this.coNormalForm.patchValue({
      freguesiaResidencia: ''
    });

    if (this.coNormalForm.get('dataNascimento').value) {
      // Create an parse to the data nascimento
      this.coNormalForm.patchValue({
        dataNascimento: null
      });
    }

    this.naturalidadeConcelhoList = this.initialList;
    this.naturalidadeFreguesiaList = this.initialList;

    this.residenciaConcelhoList = this.initialList;
    this.residenciaFreguesiaList = this.initialList;

    this.dataNascimentoAnoAux = '';
    this.dataNascimentoMesAux = '';
    this.dataNascimentoDiaAux = '';

    this.coNormalForm.patchValue({
      chkNascDesconhecida: false
    });

    this.coNormalForm.patchValue({
      nacionalidade: '<Escolher>'
    });

    this.coNormalForm.patchValue({
      residencia: ''
    });
  }
}
