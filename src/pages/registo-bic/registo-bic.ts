import { Router } from '@angular/router';
import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import {
  NavParams,
  ModalController,
  IonContent,
  NavController,
  AlertController
} from '@ionic/angular';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

// Models
import { BoletimInformacaoClinica } from '../../models/bic-model';

// Sucess Page
import { SucessoBicPageComponent } from '../sucesso-bic/sucesso-bic';

// Components
import { ListModalComponent } from '../../components/list-modal/list-modal';

// Providers
import { MsicoAlertsProvider } from '../../providers/msico-alerts/msico-alerts';
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';
import { MsicoGeneratePdfProvider } from '../../providers/msico-generate-pdf/msico-generate-pdf';
import { MsicoWebServicesBicProvider } from '../../providers/msico-web-services-bic/msico-web-services-bic';

@Component({
  selector: 'page-registo-bic',
  templateUrl: 'registo-bic.html'
})
export class RegistoBicPageComponent implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  readonly iconArrowUp = 'ios-arrow-up';
  readonly iconArrowDown = 'ios-arrow-down';

  bicForm: FormGroup;

  public inputsBIC: BoletimInformacaoClinica;

  private initialData;

  // Booleans
  public controlDisable;
  public blockDistrito;
  public blockConcelho;
  public blockFreguesia;
  public guardarCheck;

  // Form Parsed
  private formParsed;

  // Elements
  private elementsErrors;
  private elementsAlerts;

  // Show Checkmark
  public showCheckMarkIcon;

  // Show Close
  public showCloseIcon;

  // Show Close (BIC)
  public showCloseIconBIC;

  // Show CheckMark (BIC)
  public showCheckIconBIC;

  // Booleans
  public errorsOnValidation;
  public alertsOnValidation;
  public showSubmitMessage;
  public showSucessMessage;
  public alertResCovid19SuspeitoAux = false;

  public identFale;
  public identCircunstancial;
  public informacaoClinica;
  public identifiMedico;
  public desactivateConfirm;
  private searchByCO;
  private searchBySNSOrBI;

  public customOptions: any = {
    buttons: [
      {
        text: 'Cancelar',
        handler: () => this.cleanDataFalecidoHandler()
      }
    ]
  };

  public customDataNascimentoOptions: any = {
    buttons: [
      {
        text: 'Cancelar',
        handler: () => this.cleanDataNascimentoHandler()
      }
    ]
  };

  public customAdmitidoEmOptions: any = {
    buttons: [
      {
        text: 'Cancelar',
        handler: () => this.cleanDataAdmissaoHandler()
      }
    ]
  };

  public customHorasFalecidoOptions: any = {
    buttons: [
      {
        text: 'Cancelar',
        handler: () => this.bicForm.controls['horaFalecido'].setValue(null)
      }
    ]
  };

  public customHorasObitoOptions: any = {
    buttons: [
      {
        text: 'Cancelar',
        handler: () => this.bicForm.controls['horaObito'].setValue(null)
      }
    ]
  };

  public customHorasAdmissaoOptions: any = {
    buttons: [
      {
        text: 'Cancelar',
        handler: () => this.bicForm.controls['horaAdmissao'].setValue(null)
      }
    ]
  };

  public customDataAdmissaoLocalTransfOptions: any = {
    buttons: [
      {
        text: 'Cancelar',
        handler: () =>
          this.bicForm.controls['dataAdmissaoLocalTransf'].setValue(null)
      }
    ]
  };

  // selectOptionsSexo
  public selectOptionsSexo = {
    title: 'Sexo'
  };

  // selectOptionsSexo
  public selectOptionsEstadoCivil = {
    title: 'Estado Civil'
  };

  // selectOptionsPais
  public selectOptionsPais = {
    title: 'País'
  };

  // selectOptionsDistrito
  public selectOptionsDistrito = {
    title: 'Distrito'
  };

  // selectOptionsDistrito
  public selectOptionsConcelho = {
    title: 'Concelho'
  };

  // selectOptionsDistrito
  public selectOptionsFreguesia = {
    title: 'Freguesia'
  };

  // selectOptionsDistrito
  public selectOptionsTipoContacto = {
    title: 'Tipo Contacto'
  };

  // selectOptionsAdmitidoInstSaude
  public selectOptionsAdmitidoInstSaude = {
    title: 'Admitido em instituição de saúde'
  };

  // selectOptionsChegouCadaver
  public selectOptionsChegouCadaver = {
    title: 'Chegou Cádaver'
  };

  // selectOptionsMoradaProfissional
  public selectOptionsMoradaProfissional = {
    title: 'Morada Profissional'
  };

  // selectOptionsTipoEntidade
  public selectOptionsTipoEntidade = {
    title: 'Tipo Entidade'
  };

  // selectOptionsInstituicao
  public selectOptionsInstituicao = {
    title: 'Instituição'
  };

  // selectOptionsServiço
  public selectOptionsServico = {
    title: 'Serviço'
  };

  checkIcon: any = 'ios-checkmark-circle';
  closeIcon: any = 'ios-close-circle';
  identFaleIcon: any = this.iconArrowDown;
  identCircunstancialIcon = this.iconArrowDown;
  informacaoClinicaIcon = this.iconArrowDown;
  identifiMedicoIcon = this.iconArrowDown;

  // Data Admissão Transferido
  private dataAdmissaoLocalTransf: string;
  private dataAdmissaoLocalTransfAnoAux: string;
  private dataAdmissaoLocalTransfMesAux: string;
  private dataAdmissaoLocalTransfDiaAux: string;

  // List Errors and Alerts of the BI or SNS validation
  listErrorsBISNSValidation;
  listAlertsBISNSValidation;

  // List Errors and Alerts of BIC validation
  listErrorsBICValidation;
  listAlertsBICValidation;

  // Data Admissão
  private dataAdmissao: string;
  private dataAdmissaoAnoAux: string;
  private dataAdmissaoMesAux: string;
  private dataAdmissaoDiaAux: string;

  // Data de Nascimento
  private dataNascimentoAnoAux: string;
  private dataNascimentoMesAux: string;
  private dataNascimentoDiaAux: string;

  // Data Falecido
  private dataFalecidoAnoAux: string;
  private dataFalecidoMesAux: string;
  private dataFalecidoDiaAux: string;

  // Data Obito
  private dataObitoAnoAux: string;
  private dataObitoMesAux: string;
  private dataObitoDiaAux: string;

  public paisList: any;
  public distritoList: any;
  public concelhoList: any;
  public freguesiaList: any;

  private listHospistais: any;

  // Lists
  list;
  instSaudeList;

  // List Erros/Alertas
  listErrorsValidation;
  listAlertsValidation;

  // Label
  public instituicaoSaudeLabel = '<Escolher>';
  public instituicaoLabel = '<Escolher>';
  public servicoLabel = '<Escolher>';
  readonly numBIAlertLabel = 'O não preenchimento do número de Identificação Civil pode dificultar a identificação da pessoa falecida e a filiação, tem a certeza que pretende continuar?';
  readonly numUtenteAlertLabel = 'O não preenchimento do Número de Utente do SNS dificulta o reporte do óbito ao Registo Nacional de Utente (RNU), tem a certeza que pretende continuar?';
  readonly numBIAndNumUtenteAlertLabel = 'O Número de Identificação Civil e o Número de Utente do SNS não estão identificados. O não preenchimento de qualquer um dos campos dificulta a identificação da pessoa falecida e a filiação. Tem a certeza que são desconhecidos?';

  // DatePicker minimum value for specific cases
  dataPickerMin: any;

  // Data nascimento checkbox controller
  public dataNascimentoChkController = 0;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private msicoWebServices: MsicoWebServicesBicProvider,
    private msicoLoading: MsicoLoadingProvider,
    private msicoAlerts: MsicoAlertsProvider,
    private msicoGeneratePDF: MsicoGeneratePdfProvider,
    public ngZone: NgZone,
    public formBuilder: FormBuilder,
    public router: Router
  ) {}

  // Init
  ngOnInit() {
    // Add the initialData data from the previous page
    this.ngZone.run(() => {
      //this.initialData = this.navParams.get('initialData');
      //this.list = this.navParams.get('initialList').dadosOutput;

      if (this.router.getCurrentNavigation().extras.state) {
        const params: any = this.router.getCurrentNavigation().extras.state;
        console.log('params: ',  params);
  
        this.initialData = params.initialData;
        this.list = params.initialList;
      }
    });

    this.paisList = this.list.listaPais;
    this.distritoList = this.list.listaDistrito;

    this.dataAdmissaoLocalTransf = null;

    this.dataAdmissao = null;
    this.dataAdmissaoAnoAux = null;
    this.dataAdmissaoMesAux = null;
    this.dataAdmissaoDiaAux = null;

    this.dataAdmissaoLocalTransf = null;
    this.dataAdmissaoLocalTransfAnoAux = null;
    this.dataAdmissaoLocalTransfMesAux = null;
    this.dataAdmissaoLocalTransfDiaAux = null;

    this.bicForm = this.formBuilder.group({
      idBic: new FormControl({ value: '', disabled: this.controlDisable }),
      idCivil: new FormControl({ value: '', disabled: this.controlDisable }),
      nutente: new FormControl({ value: '', disabled: this.controlDisable }),
      nome: new FormControl({ value: null, disabled: this.controlDisable }),
      nomePai: new FormControl({ value: null, disabled: this.controlDisable }),
      nomeMae: new FormControl({ value: null, disabled: this.controlDisable }),
      dataNascimento: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      profissao: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      chkProfissaoDesconhecida: new FormControl({
        value: false,
        disabled: this.controlDisable
      }),
      sexo: new FormControl({ value: '', disabled: this.controlDisable }),
      diaNascimento: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      mesNascimento: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      anoNascimento: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      estadoCivil: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      pais: new FormControl({
        value: this.initialData.pais,
        disabled: this.controlDisable
      }),
      distrito: new FormControl({ value: '', disabled: this.controlDisable }),
      concelho: new FormControl({ value: '', disabled: this.controlDisable }),
      freguesia: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      tipoContacto: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      contactoFamiliar: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      infoAdmissao: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      resCovid19: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      transferidoDe: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      dataAdmissaoLocalTransf: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      admitidoInstSaude: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      dataAdmissao: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      horaAdmissao: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      chegouCadaver: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      dataFalecido: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      diaFalecido: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      mesFalecido: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      anoFalecido: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      horaFalecido: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      dataObito: new FormControl({ value: '', disabled: this.controlDisable }),
      diaObito: new FormControl({ value: null, disabled: this.controlDisable }),
      mesObito: new FormControl({ value: '', disabled: this.controlDisable }),
      anoObito: new FormControl({ value: '', disabled: this.controlDisable }),
      horaObito: new FormControl({ value: '', disabled: this.controlDisable }),
      situacaoClinica: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      internamentoEnf: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      evolucaoClinica: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      examesComplementares: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      antecedentesGerais: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      diagnostico: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      terapeuticas: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      prodBio: new FormControl({ value: null, disabled: this.controlDisable }),
      vestigios: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      outrosElementos: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      observacoes: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      medicoNome: new FormControl({
        value: this.initialData.medicoNome,
        disabled: this.controlDisable
      }),
      medicoTipoContacto: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      medicoContacto: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      medicoCedulaProf: new FormControl({
        value: this.initialData.medicoCedulaProf,
        disabled: this.controlDisable
      }),
      operacao: new FormControl({ value: '', disabled: this.controlDisable }),
      msgConfirmacao: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      idCO: new FormControl({ value: '', disabled: this.controlDisable }),
      tipoCO: new FormControl({ value: '', disabled: this.controlDisable }),
      numCO: new FormControl({ value: '', disabled: this.controlDisable }),
      titulo: new FormControl({ value: '', disabled: this.controlDisable }),
      numBic: new FormControl({ value: '', disabled: this.controlDisable }),
      dataEmissaoComHora: new FormControl({
        value: this.initialData.dataEmissaoComHora,
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
      tipoMoradaProfissional: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      moradaProfissionalOutro: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      tipoEntidade: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      codigoSaudeProfissional: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      codigoInmlProfissional: new FormControl({
        value: null,
        disabled: this.controlDisable
      }),
      tipoServico: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      servicoOutro: new FormControl({
        value: '',
        disabled: this.controlDisable
      }),
      versaoCertificado: new FormControl({
        value: '1',
        disabled: this.controlDisable
      })
    });

    this.elementsErrors = document.getElementsByClassName(
      'errorValidationItem'
    );
    this.elementsAlerts = document.getElementsByClassName(
      'alertValidationItem'
    );

    this.controlDisable = false;
    this.blockDistrito = false;
    this.blockConcelho = false;
    this.blockFreguesia = false;
    this.guardarCheck = false;

    this.errorsOnValidation = false;
    this.alertsOnValidation = false;
    this.showSubmitMessage = false;
    this.showSucessMessage = false;

    this.identFale = false;
    this.identCircunstancial = false;
    this.informacaoClinica = false;
    this.identifiMedico = false;
    this.desactivateConfirm = false;

    this.searchByCO = false;
    this.searchBySNSOrBI = false;

    this.dataNascimentoAnoAux = '';
    this.dataNascimentoMesAux = '';
    this.dataNascimentoDiaAux = '';

    this.dataObitoAnoAux = '';
    this.dataObitoMesAux = '';
    this.dataObitoDiaAux = '';

    if (this.bicForm.get('dataEmissao').value) {
      let dateString = this.bicForm.get('dataEmissao').value.split('-');
      this.dataPickerMin = (parseInt(dateString[2]) - 8).toString();
    }
  }

  onBlur($event): void {
    this.cleanPaintErrors();
    this.cleanPaintAlerts();

    if ($event.value !== undefined && $event.value !== '') {
      if ($event.ngControl.name === 'numCO') {
        this.getDataCOBic();
      } else if (
        $event.ngControl.name === 'idCivil' ||
        $event.ngControl.name === 'nutente'
      ) {
        this.getDadosFalecidoBIC();
      }
    } else if ($event.value === '') {
      if ($event.ngControl.name === 'numCO') {
        this.showCheckIconBIC = false;
        this.showCloseIconBIC = false;

        this.listErrorsBICValidation = null;
        this.listAlertsBICValidation = null;
      } else if (
        $event.ngControl.name === 'idCivil' ||
        $event.ngControl.name === 'nutente'
      ) {
        this.listAlertsBISNSValidation = null;
        this.listErrorsBISNSValidation = null;

        this.showCloseIcon = false;
        this.showCheckMarkIcon = false;
      }
    }
  }

  // When clicked scroll to Top
  scrollToTop(): void {
    this.content.scrollToTop();
  }

  // When clicked scroll to Bottom
  scrollToBottom(): void {
    this.content.scrollToBottom();
  }

  // By clicking on the error list
  clickToTheField(value): void {
    let top = document.getElementById(value[0]).offsetTop;

    if (top !== 0 || top !== null) {
      this.content.scrollToPoint(0, top - 10, 1000);
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
  parseData(data, typeofList): void {
    if (typeofList === 'instSaude') {
      this.instituicaoSaudeLabel = data.labelData;
      this.bicForm.patchValue({ codigoSaudeProfissional: data.DataData });
    } else if (typeofList === 'inst') {
      this.instituicaoLabel = data.labelData;
      this.bicForm.patchValue({ codigoInmlProfissional: data.DataData });
    } else if (typeofList === 'tipoServico') {
      this.servicoLabel = data.labelData;
      this.bicForm.patchValue({ tipoServico: data.DataData });
    }
  }

  /*It handles the dataAdmissaoLocalTransf and if is notnot null then,split the value into three different values
    the server is expecting three different values which is year, month an day separately*/
  dataAdmissaoLocalTransfHandler(): void {
    if (this.bicForm.get('dataAdmissaoLocalTransf').value) {
      let dataAdmissaoLocalTransF = this.bicForm
        .get('dataAdmissaoLocalTransf')
        .value.split('-');

      this.dataAdmissaoAnoAux = dataAdmissaoLocalTransF[2];
      this.dataAdmissaoMesAux = ('0' + dataAdmissaoLocalTransF[1]).slice(-2);
      this.dataAdmissaoDiaAux = dataAdmissaoLocalTransF[0];

      this.dataAdmissaoLocalTransf =
        this.dataAdmissaoAnoAux +
        '-' +
        this.dataAdmissaoMesAux +
        '-' +
        this.dataAdmissaoDiaAux;
    }
  }

  /*It handles the dataAdmissao and if is not null then,split the value into three different values
    the server is expecting three different values which is year, month an day separately*/
  dataAdmissaoValuesHandler(): void {
    if (this.bicForm.get('dataAdmissao').value) {
      let dataAdmissao = this.bicForm.get('dataAdmissao').value.split('-');

      this.dataAdmissaoAnoAux = dataAdmissao[2];
      this.dataAdmissaoMesAux = ('0' + dataAdmissao[1]).slice(-2);
      this.dataAdmissaoDiaAux = dataAdmissao[0];

      this.dataAdmissao =
        this.dataAdmissaoAnoAux +
        '-' +
        this.dataAdmissaoMesAux +
        '-' +
        this.dataAdmissaoDiaAux;
    } else {
      this.dataAdmissao = null;
    }
  }

  // Clean Data Admissao field
  cleanDataAdmissaoHandler() {
    this.dataAdmissaoAnoAux = '';
    this.dataAdmissaoMesAux = '';
    this.dataAdmissaoDiaAux = '';

    this.bicForm.patchValue({
      dataAdmissao: ''
    });
  }

  /*It handles the dataNascimento and if is not null then,split the value into three different values
    the server is expecting three different values which is year, month an day separately*/
  dataNascimentoHandler(): void {
    // If handler has been called then change the dataNascimentoChkController value
    this.dataNascimentoChkController = 1;

    if (this.bicForm.get('dataNascimento').value) {
      let dataNascimento = new Date(this.bicForm.get('dataNascimento').value);

      this.dataNascimentoAnoAux = dataNascimento.getFullYear().toString();
      this.dataNascimentoMesAux = ('0' + (dataNascimento.getMonth() + 1)).slice(
        -2
      );
      this.dataNascimentoDiaAux = ('0' + dataNascimento.getDate()).slice(-2);
    }

    // Extra remove loading method to prevent loading controller malfunction
    this.msicoLoading.onLoadingRemove();

    if (
      this.bicForm.get('dataNascimento').value !== null &&
      !this.searchByCO &&
      !this.searchBySNSOrBI
    ) {
      this.msicoLoading.onLoading();

      this.msicoWebServices
        .getListagemBICEspecificaDataNascimentoAlteradaServices(
          this.dataNascimentoAnoAux,
          this.dataNascimentoMesAux,
          this.dataNascimentoDiaAux,
          this.bicForm.get('distrito').value,
          this.bicForm.get('concelho').value,
          this.dataObitoAnoAux,
          this.dataObitoMesAux,
          this.dataObitoDiaAux
        )
        .subscribe(
          data => {
            let dataRetrieved: any = data;

            this.msicoLoading.onLoadingRemove();

            if (dataRetrieved.dadosOutput !== null) {
              if (dataRetrieved.dadosOutput.listaPais !== null) {
                this.list.naturalidadePais = dataRetrieved.dadosOutput.listaPais;
              }
              if (dataRetrieved.dadosOutput.listaDistrito) {
                // Check if distrito's value exists in new listaDistrito list from server (if not, clean associated fields)
                let listaDistritoServerList = dataRetrieved.dadosOutput.listaDistrito.map(a => a.value);
                if (!listaDistritoServerList.includes(this.bicForm.get('distrito').value)) {
                  this.bicForm.patchValue({ distrito: '' });
                  this.bicForm.patchValue({ concelho: '' });
                  this.bicForm.patchValue({ freguesia: '' });
                }

                this.distritoList = dataRetrieved.dadosOutput.listaDistrito;
              }
              if (dataRetrieved.dadosOutput.listaConcelho) {
                // Check if concelho's value exists in new listaConcelho list from server (if not, clean associated fields)
                let listaConcelhoServerList = dataRetrieved.dadosOutput.listaConcelho.map(a => a.value);
                if (!listaConcelhoServerList.includes(this.bicForm.get('concelho').value)) {
                  this.bicForm.patchValue({ concelho: '' });
                  this.bicForm.patchValue({ freguesia: '' });
                }

                this.concelhoList = dataRetrieved.dadosOutput.listaConcelho;
              }
              if (dataRetrieved.dadosOutput.listaFreguesia) {
                // Check if freguesia's value exists in new listaFreguesia list from server (if not, clean associated fields)
                let listaFreguesiaServerList = dataRetrieved.dadosOutput.listaFreguesia.map(a => a.value);
                if (!listaFreguesiaServerList.includes(this.bicForm.get('freguesia').value)) {
                  this.bicForm.patchValue({ freguesia: '' });
                }

                this.freguesiaList = dataRetrieved.dadosOutput.listaFreguesia;
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

  // Clean Data Nascimento field
  cleanDataNascimentoHandler() {
    this.dataNascimentoAnoAux = '';
    this.dataNascimentoMesAux = '';
    this.dataNascimentoDiaAux = '';

    // Method to force call dataNascimentoHandler for the first time clicking the checkbox
    if (this.dataNascimentoChkController !== 1) {
      this.dataNascimentoChkController = 1;
      this.bicForm.patchValue({
        dataNascimento: ''
      });
      this.dataNascimentoHandler();
    } else {
      this.bicForm.patchValue({
        dataNascimento: ''
      });
    }
  }

  /*It handles the dataFalecido and if is not null then,split the value into three different values
    the server is expecting three different values which is year, month an day separately*/
  dataFalecimentoHandler(): void {
    if (this.bicForm.get('dataFalecido').value) {
      let dataFalecido = new Date(this.bicForm.get('dataFalecido').value);

      this.dataFalecidoAnoAux = dataFalecido.getFullYear().toString();
      this.dataFalecidoMesAux = ('0' + (dataFalecido.getMonth() + 1)).slice(-2);
      this.dataFalecidoDiaAux = ('0' + dataFalecido.getDate()).slice(-2);
    }
  }

  // Clean Data Falecido field
  cleanDataFalecidoHandler(): void {
    this.dataFalecidoMesAux = '';
    this.dataFalecidoDiaAux = '';
    this.dataFalecidoAnoAux = '';

    this.bicForm.patchValue({
      dataFalecido: ''
    });
  }

  /*It handles the dataObito and if is not null then,split the value into three different values
    the server is expecting three different values which is year, month an day separately*/
  dataObitoHandler(): void {
    if (this.bicForm.get('dataObito').value) {
      let dataObito = new Date(this.bicForm.get('dataObito').value);

      this.dataObitoAnoAux = dataObito.getFullYear().toString();
      this.dataObitoMesAux = ('0' + (dataObito.getMonth() + 1)).slice(-2);
      this.dataObitoDiaAux = ('0' + dataObito.getDate()).slice(-2);
    }
  }

  populateConcelhoList(dataValue?: any): void {
    // Clean data
    this.bicForm.patchValue({ concelho: '' });
    this.bicForm.patchValue({ freguesia: '' });

    if (!this.searchByCO && !this.searchBySNSOrBI) {
      // Call the webservice getSpecificFetalListNaturalidadeConcelho_services to retrieve the data
      this.msicoWebServices
        .getSpecificBICListNaturalidadeConcelhoServices(
          this.dataNascimentoAnoAux,
          this.dataNascimentoMesAux,
          this.dataNascimentoDiaAux,
          this.bicForm.get('distrito').value,
          this.dataObitoAnoAux,
          this.dataObitoMesAux,
          this.dataObitoDiaAux
        )
        .subscribe(
          data => {
            let dataRetrieved: any = data;

            if (dataRetrieved.dadosOutput) {
              if (dataValue !== undefined) {
                this.bicForm.patchValue({ concelho: dataValue });
              }
              this.concelhoList = dataRetrieved.dadosOutput.listaConcelho;
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

  populateFreguesiaList(): void {
    // Clean data
    this.bicForm.patchValue({ freguesia: '' });

    if (!this.searchByCO && !this.searchBySNSOrBI) {
      // Call the webservice getSpecificListFetalNaturalidadeFreguesia_services to retrieve the data
      this.msicoWebServices
        .getSpecificListBICNaturalidadeFreguesiaServices(
          this.dataNascimentoAnoAux,
          this.dataNascimentoMesAux,
          this.dataNascimentoDiaAux,
          this.bicForm.get('distrito').value,
          this.bicForm.get('concelho').value,
          this.dataObitoAnoAux,
          this.dataObitoMesAux,
          this.dataObitoDiaAux
        )
        .subscribe(
          data => {
            let dataRetrieved: any = data;

            if (dataRetrieved.dadosOutput) {
              this.freguesiaList = dataRetrieved.dadosOutput.listaFreguesia;
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

  populateInstSaudeList(): void {
    this.instituicaoSaudeLabel = '<Escolher>';

    this.bicForm.patchValue({ codigoSaudeProfissional: '' });

    this.servicoLabel = '<Escolher>';
    this.bicForm.patchValue({ tipoServico: '' });

    let tipoEntidadeNumber: number = this.bicForm.get('tipoEntidade').value;

    this.listHospistais = [];
    this.listHospistais = [
      this.list.listHospitaisMed,
      this.list.listUACMed,
      this.list.listOutrosMed
    ];
    this.instSaudeList = this.listHospistais[tipoEntidadeNumber - 1];
  }

  // Clean current inputs from the form
  clearTipoEntidade(): void {
    this.instituicaoLabel = '<Escolher>';
    this.instituicaoSaudeLabel = '<Escolher>';
    this.servicoLabel = '<Escolher>';
    this.bicForm.patchValue({ codigoInmlProfissional: '' });
    this.bicForm.patchValue({ tipoEntidade: '' });
    this.bicForm.patchValue({ tipoServico: '' });
    this.bicForm.patchValue({ moradaProfissionalOutro: '' });
    this.servicoLabel = '<Escolher>';
  }

  /**
   * Validates if BI and/or NIC values are empty.
   */
  onValidateBiNicFields({ value }: { value: BoletimInformacaoClinica }) {
    if (!this.bicForm.get('idCivil').value && !this.bicForm.get('nutente').value) {
      this.dynamicConfirmAlertsMessages(this.numBIAndNumUtenteAlertLabel, 'idCivil', value);
    } else if (this.bicForm.get('idCivil').value && !this.bicForm.get('nutente').value) {
      this.dynamicConfirmAlertsMessages(this.numUtenteAlertLabel, 'nutente', value);
    } else if (!this.bicForm.get('idCivil').value && this.bicForm.get('nutente').value) {
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
  async  dynamicConfirmAlertsMessages(dynamicMessage: any, elementName: string, value: BoletimInformacaoClinica) {
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
  onSubmitForm({ value }: { value: BoletimInformacaoClinica }): void {
    this.msicoLoading.onLoading();

    this.showCheckIconBIC = false;
    this.showCheckMarkIcon = false;
    this.showCloseIcon = false;
    this.showCloseIconBIC = false;

    this.listAlertsBICValidation = null;
    this.listAlertsBISNSValidation = null;

    this.listErrorsBICValidation = null;
    (this.listErrorsBISNSValidation = null), event.preventDefault();

    delete value.dataNascimento;
    delete value.dataFalecido;
    delete value.dataObito;
    delete value.idCO;

    this.formParsed = value;

    // Default values on submit
    value.dataEmissaoComHora =
      this.initialData.dataEmissao + ' ' + this.initialData.horaEmissao;

    /*If the dataNascimento is not null then,split the value into three different values
    *the server is expecting three different values which is year, month an day separately*/
    value.anoNascimento = this.dataNascimentoAnoAux;
    value.mesNascimento = this.dataNascimentoMesAux;
    value.diaNascimento = this.dataNascimentoDiaAux;

    /*If the dataFalecido is not null then,split the value into three different values
    *the server is expecting three different values which is year, month an day separately*/
    value.anoFalecido = this.dataFalecidoAnoAux;
    value.mesFalecido = this.dataFalecidoMesAux;
    value.diaFalecido = this.dataFalecidoDiaAux;

    /*If the dataObito is not null then,split the value into three different values
    *the server is expecting three different values which is year, month an day separately*/
    value.anoObito = this.dataObitoAnoAux;
    value.mesObito = this.dataObitoMesAux;
    value.diaObito = this.dataObitoDiaAux;

    /*If the dataAdmissaoLocalTransf is not null then split the value
    into and create an string with the three values to submit*/
    value.dataAdmissaoLocalTransf = this.dataAdmissaoLocalTransf;

    /*If the dataAdmissao is not null then split the value
   into and create an string with the three values to submit*/
    value.dataAdmissao = this.dataAdmissao;

    let listVerify: any;

    // If the idCivil is not null then remove leading zeros
    if (this.bicForm.get('idCivil').value) {
      value.idCivil = parseInt(value.idCivil.toString(), 10);
      let newValueidCivil = value.idCivil.toString().replace(/^0+/, '');
      this.bicForm.patchValue({ idCivil: newValueidCivil });
    }

    // Call the webservices to validation
    this.msicoWebServices.verifyBIC(value, 'regista').subscribe(
      data => {
        listVerify = data;
        let element: any;

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

          // Open Sections
          this.identFale = true;
          this.identCircunstancial = true;
          this.informacaoClinica = true;
          this.identifiMedico = true;

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
          // If the result is 0 then
          this.errorsOnValidation = false;
          this.alertsOnValidation = false;
          this.showSubmitMessage = true;
          this.controlDisable = true;
          this.guardarCheck = true;
        } else if (listVerify.resultadoOutput === '1') {
          // Open Sections
          this.identFale = true;
          this.identCircunstancial = true;
          this.informacaoClinica = true;
          this.identifiMedico = true;

          // If the result is 1 then
          this.errorsOnValidation = false;
          this.showSubmitMessage = true;
          this.alertsOnValidation = true;
          this.controlDisable = true;
          this.guardarCheck = true;

          // List of alerts to be displayed
          this.listAlertsValidation =
            listVerify.dadosOutput.listaAlertasComCampo;

          // If numCO is sent from from the server then patch value
          if (listVerify.dadosOutput.numCO) {
            this.bicForm.patchValue({
              numCO: listVerify.dadosOutput.numCO
            });
          }

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

        // Dismiss loader
        this.msicoLoading.onLoadingRemove();

        // Scroll to the top
        this.content.scrollToTop();
      },
      err => {
        if (err) {
          this.msicoLoading.onLoadingRemove();
          this.msicoAlerts.handlerError(err, this.navCtrl);
        }
      }
    );
  }

  // Clean the profissao input from the form
  clearProfissao(): void {
    this.bicForm.patchValue({ profissao: '', disabled: true });
  }

  // It handles the country
  paisHandler(): void {
    if (this.bicForm.get('pais').value !== 'PT') {
      this.bicForm.patchValue({ distrito: '' });
      this.bicForm.patchValue({ concelho: '' });
      this.bicForm.patchValue({ freguesia: '' });

      this.blockDistrito = true;
      this.blockConcelho = true;
      this.blockFreguesia = true;
    } else {
      this.blockDistrito = false;
      this.blockConcelho = false;
      this.blockFreguesia = false;
    }
  }

  // After validition, on the final submission
  onSubmitData(): void {
    this.desactivateConfirm = true;

    this.msicoLoading.onLoading();

    // Call the webservice submitSucessBIC to send the final data to the server
    this.msicoWebServices.submitSucessBIC(this.formParsed, 'regista').subscribe(
      data => {
        let dataRetrieved: any = data;
        let element: any;

        // If the result is 2 then
        if (dataRetrieved.resultadoOutput === '2') {
          this.msicoLoading.onLoadingRemove();

          this.errorsOnValidation = true;

          this.showSubmitMessage = false;
          this.alertsOnValidation = false;
          this.showSucessMessage = false;
          this.controlDisable = false;

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
          this.msicoLoading.onLoadingRemove();

          // If the result is 0 then
          this.errorsOnValidation = false;
          this.alertsOnValidation = false;
          this.showSubmitMessage = true;
          this.controlDisable = true;
          this.guardarCheck = true;

          this.bicForm.patchValue({ idBic: dataRetrieved.dadosOutput.idBic });

          this.navCtrl.navigateForward('sucessoBic', {
            state: {
              numBic: dataRetrieved.dadosOutput.numBic,
              idBic: dataRetrieved.dadosOutput.idBic,
              msgConfirmacao: dataRetrieved.dadosOutput.msgConfirmacao,
              operation: 'registo'
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
    this.alertsOnValidation = false;
    this.showSubmitMessage = false;
    this.controlDisable = false;
    this.guardarCheck = false;
    this.content.scrollToTop();
  }

  // It handles the show and hide sections of the form
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
      this.identCircunstancialIcon = this.identCircunstancial
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
    if (sectionDescription === 'identifiMedico') {
      this.identifiMedico = !this.identifiMedico;
      this.identifiMedicoIcon = this.identifiMedico
        ? this.iconArrowUp
        : this.iconArrowDown;
    }
  }

  // Create PDF from base64 string
  pdfHandler(value: string): void {
    if (value === 'ImpressaoBIC') {
      this.msicoLoading.onLoading();

      // Call the web services to get the 64 binary code
      this.msicoWebServices
        .getBicPdf64(this.bicForm.get('idBic'), 'bic')
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
    } else if (value === 'ImpressaoBICTransporte') {
      this.msicoLoading.onLoading();

      // Call the web services to get the 64 binary code
      this.msicoWebServices
        .getBicPdf64(this.bicForm.get('idBic'), 'bic_sem_dados_saude')
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

  // Get data from the server based on the number of ID Civil and SNS
  getDadosFalecidoBIC(): void {
    // Loading
    this.msicoLoading.onLoading();

    // Clean inputs before
    this.bicForm.patchValue({ nome: '' });
    this.bicForm.patchValue({ nomePai: '' });
    this.bicForm.patchValue({ nomeMae: '' });
    this.bicForm.patchValue({ sexo: '' });

    if (this.bicForm.get('dataNascimento').value) {
      this.bicForm.patchValue({
        dataNascimento: ''
      });
    }

    this.dataNascimentoAnoAux = '';
    this.dataNascimentoMesAux = '';
    this.dataNascimentoDiaAux = '';

    this.bicForm.patchValue({
      anoNascimento: this.dataNascimentoAnoAux
    });
    this.bicForm.patchValue({
      mesNascimento: this.dataNascimentoMesAux
    });
    this.bicForm.patchValue({
      diaNascimento: this.dataNascimentoDiaAux
    });

    this.bicForm.patchValue({ estadoCivil: '' });
    this.bicForm.patchValue({ pais: '' });
    this.bicForm.patchValue({ distrito: '' });
    this.bicForm.patchValue({ concelho: '' });
    this.bicForm.patchValue({ freguesia: '' });

    this.msicoWebServices
      .getDadosFalecidoBIC(
        this.bicForm.get('nutente').value,
        this.bicForm.get('idCivil').value,
        this.dataObitoAnoAux,
        this.dataObitoMesAux,
        this.dataObitoDiaAux
      )
      .subscribe(
        data => {
          let dataRetrieved: any = data;

          this.searchBySNSOrBI = true;

          if (dataRetrieved.dadosOutput.idCivil) {
            this.bicForm.patchValue({
              idCivil: dataRetrieved.dadosOutput.idCivil
            });
          }
          if (dataRetrieved.dadosOutput.nome) {
            this.bicForm.patchValue({ nome: dataRetrieved.dadosOutput.nome });
          }
          if (dataRetrieved.dadosOutput.nomePai) {
            this.bicForm.patchValue({
              nomePai: dataRetrieved.dadosOutput.nomePai
            });
          }
          if (dataRetrieved.dadosOutput.nomeMae) {
            this.bicForm.patchValue({
              nomeMae: dataRetrieved.dadosOutput.nomeMae
            });
          }
          if (dataRetrieved.dadosOutput.sexo) {
            this.bicForm.patchValue({ sexo: dataRetrieved.dadosOutput.sexo });
          }

          /*If the nascimentoAno is not null then split the value into and create an string
        with the three values to submit*/
          // Create an parse to the data nascimento
          if (
            dataRetrieved.dadosOutput.anoNascimento !== null &&
            dataRetrieved.dadosOutput.mesNascimento !== null &&
            dataRetrieved.dadosOutput.diaNascimento !== null
          ) {
            this.bicForm.patchValue({
              dataNascimento:
                dataRetrieved.dadosOutput.anoNascimento +
                '-' +
                this.pad(dataRetrieved.dadosOutput.mesNascimento, 2, 0) +
                '-' +
                this.pad(dataRetrieved.dadosOutput.diaNascimento, 2, 0)
            });
          }

          this.dataNascimentoAnoAux = dataRetrieved.dadosOutput.anoNascimento;
          this.dataNascimentoMesAux = dataRetrieved.dadosOutput.mesNascimento;
          this.dataNascimentoDiaAux = dataRetrieved.dadosOutput.diaNascimento;

          this.bicForm.patchValue({
            anoNascimento: this.dataNascimentoAnoAux
          });
          this.bicForm.patchValue({
            mesNascimento: this.dataNascimentoMesAux
          });
          this.bicForm.patchValue({
            diaNascimento: this.dataNascimentoDiaAux
          });

          this.paisList = dataRetrieved.dadosOutput.listaPais;

          if (dataRetrieved.dadosOutput.pais) {
            this.bicForm.patchValue({ pais: dataRetrieved.dadosOutput.pais });
            this.paisHandler();
          }

          this.distritoList = dataRetrieved.dadosOutput.listaDistrito;

          if (dataRetrieved.dadosOutput.distrito) {
            this.bicForm.patchValue({
              distrito: dataRetrieved.dadosOutput.distrito
            });
          }

          this.concelhoList = dataRetrieved.dadosOutput.listaConcelho;

          if (dataRetrieved.dadosOutput.concelho) {
            this.bicForm.patchValue({
              concelho: dataRetrieved.dadosOutput.concelho
            });
          }

          this.freguesiaList = dataRetrieved.dadosOutput.listaFreguesia;

          if (dataRetrieved.dadosOutput.freguesia) {
            this.bicForm.patchValue({
              freguesia: dataRetrieved.dadosOutput.freguesia
            });
          }

          // If the result is 0 or 1 then
          if (dataRetrieved.resultadoOutput === '0') {
            // Loading Remove
            this.msicoLoading.onLoadingRemove();

            this.showCheckMarkIcon = true;
            this.showCloseIcon = false;

            this.searchBySNSOrBI = false;

            // Certificado Obito Validation and icons
            this.listErrorsBICValidation = null;
            this.showCheckIconBIC = false;
            this.showCloseIconBIC = false;

            this.listAlertsBISNSValidation = null;
            this.listErrorsBISNSValidation = null;
          } else if (dataRetrieved.resultadoOutput === '2') {
            this.msicoLoading.onLoadingRemove();
            this.listErrorsBISNSValidation =
              dataRetrieved.dadosOutput.listaErrosComCampo;

            this.showCheckMarkIcon = false;

            this.showCloseIcon = true;

            this.searchBySNSOrBI = false;

            this.paintErrors(this.listErrorsBISNSValidation);
          } else if (dataRetrieved.resultadoOutput === '1') {
            this.msicoLoading.onLoadingRemove();
            this.showCloseIcon = true;

            this.showCheckMarkIcon = false;

            this.searchBySNSOrBI = false;

            this.listAlertsBISNSValidation =
              dataRetrieved.dadosOutput.listaAlertasComCampo;

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

  pad(n, width, z): void {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  limitValue(num: string, tempo: any, numChar: number) {
    if (num.length > numChar) {
      let obj = this.bicForm.get(tempo).value;

      obj = obj.substring(0, num.length - 1);
      this.bicForm.controls[tempo].setValue(obj);
    }
  }

  // Number input control
  numberInput(num: string, tempo: any, event: any) {
    // Event sent when input accepts only positive numbers
    if (event) {
      let newValue = event.value;
      let regExp = new RegExp('^[0-9?]+$');
      if (! regExp.test(newValue)) {
        let obj = this.bicForm.get(tempo).value;

        obj = obj.substring(0, num.length - 1);
        this.bicForm.controls[tempo].setValue(obj);
      }
    }
  }

  getDataCOBic(): void {
    this.msicoLoading.onLoadingRemove();
    // Create loading
    this.msicoLoading.onLoading();

    this.cleanPaintErrors();
    this.cleanPaintAlerts();

    // Call the webservice getDataCOBic to retrieve the data
    this.msicoWebServices
      .getDataCOBic(
        this.bicForm.get('numCO').value,
        this.bicForm.get('nutente').value,
        this.bicForm.get('idCivil').value,
        this.dataNascimentoAnoAux,
        this.dataNascimentoMesAux,
        this.dataNascimentoDiaAux,
        this.dataObitoAnoAux,
        this.dataObitoMesAux,
        this.dataObitoDiaAux,
        '',
        'regista',
        ''
      )
      .subscribe(
        data => {
          this.searchByCO = true;

          let dataRetrieved: any = data;

          // Insert automatically values from the server to the form
          if (dataRetrieved.dadosOutput.idCivil) {
            this.bicForm.patchValue({
              idCivil: dataRetrieved.dadosOutput.idCivil
            });
          }
          if (dataRetrieved.dadosOutput.nutente) {
            this.bicForm.patchValue({
              nutente: dataRetrieved.dadosOutput.nutente
            });
          }

          if (dataRetrieved.dadosOutput.nome) {
            this.bicForm.patchValue({ nome: dataRetrieved.dadosOutput.nome });
          }
          if (dataRetrieved.dadosOutput.nomePai) {
            this.bicForm.patchValue({
              nomePai: dataRetrieved.dadosOutput.nomePai
            });
          }
          if (dataRetrieved.dadosOutput.nomeMae) {
            this.bicForm.patchValue({
              nomeMae: dataRetrieved.dadosOutput.nomeMae
            });
          }
          if (dataRetrieved.dadosOutput.sexo) {
            this.bicForm.patchValue({ sexo: dataRetrieved.dadosOutput.sexo });
          }
          if (dataRetrieved.dadosOutput.estadoCivil) {
            this.bicForm.patchValue({
              estadoCivil: dataRetrieved.dadosOutput.estadoCivil
            });
          }

          // Create an parse to the data nascimento
          if (
            dataRetrieved.dadosOutput.anoNascimento !== null &&
            dataRetrieved.dadosOutput.mesNascimento !== null &&
            dataRetrieved.dadosOutput.diaNascimento !== null
          ) {
            this.bicForm.patchValue({
              dataNascimento:
                dataRetrieved.dadosOutput.anoNascimento +
                '-' +
                this.pad(dataRetrieved.dadosOutput.mesNascimento, 2, 0) +
                '-' +
                this.pad(dataRetrieved.dadosOutput.diaNascimento, 2, 0)
            });

            this.dataNascimentoAnoAux = dataRetrieved.dadosOutput.anoNascimento;
            this.dataNascimentoMesAux = dataRetrieved.dadosOutput.mesNascimento;
            this.dataNascimentoDiaAux = dataRetrieved.dadosOutput.diaNascimento;

            this.bicForm.patchValue({
              anoNascimento: this.dataNascimentoAnoAux
            });
            this.bicForm.patchValue({
              mesNascimento: this.dataNascimentoMesAux
            });
            this.bicForm.patchValue({
              diaNascimento: this.dataNascimentoDiaAux
            });
          }

          this.bicForm.patchValue({
            chkProfissaoDesconhecida:
              dataRetrieved.dadosOutput.chkProfissaoDesconhecida
          });

          if (dataRetrieved.dadosOutput.profissao) {
            this.bicForm.patchValue({
              profissao: dataRetrieved.dadosOutput.profissao
            });
          }

          if (dataRetrieved.dadosOutput.pais !== null) {
            // List Pais Naturalidade
            this.paisList = dataRetrieved.dadosOutput.listaPais;

            this.bicForm.patchValue({ pais: dataRetrieved.dadosOutput.pais });
          }

          if (dataRetrieved.dadosOutput.distrito) {
            // List Distrito Naturalidade
            this.distritoList = dataRetrieved.dadosOutput.listaDistrito;

            this.bicForm.patchValue({
              distrito: dataRetrieved.dadosOutput.distrito
            });

            // List Concelho Naturalidade
            this.concelhoList = dataRetrieved.dadosOutput.listaConcelho;

            if (dataRetrieved.dadosOutput.concelho) {
              this.bicForm.patchValue({
                concelho: dataRetrieved.dadosOutput.concelho
              });
            }

            // List Freguesia Naturalidade
            this.freguesiaList = dataRetrieved.dadosOutput.listaFreguesia;

            if (dataRetrieved.dadosOutput.freguesia) {
              this.bicForm.patchValue({
                freguesia: dataRetrieved.dadosOutput.freguesia
              });
            }
          }

          if (dataRetrieved.resultadoOutput === '0') {
            this.msicoLoading.onLoadingRemove();

            this.listErrorsBICValidation = null;
            this.listAlertsBICValidation = null;

            this.searchByCO = false;

            this.showCheckIconBIC = true;
            this.showCloseIconBIC = false;

            // Errors
          } else if (dataRetrieved.resultadoOutput === '2') {
            this.msicoLoading.onLoadingRemove();
            this.showCloseIconBIC = true;
            this.showCheckIconBIC = false;

            this.searchByCO = false;

            this.listErrorsBICValidation =
              dataRetrieved.dadosOutput.listaErrosComCampo;

            this.listAlertsBICValidation = null;

            this.paintErrors(this.listErrorsBICValidation);

            // Open Sections
            this.identFale = true;
            this.identCircunstancial = true;
            this.informacaoClinica = true;
            this.identifiMedico = true;

            // Alerts
          } else if (dataRetrieved.resultadoOutput === '1') {
            this.msicoLoading.onLoadingRemove();
            this.showCloseIconBIC = false;
            this.showCheckIconBIC = true;

            this.searchByCO = false;

            this.listAlertsBICValidation =
              dataRetrieved.dadosOutput.listaAlertasComCampo;
            this.listErrorsBICValidation = null;

            this.paintAlerts(this.listAlertsBICValidation);

            // Open Sections
            this.identFale = true;
            this.identCircunstancial = true;
            this.informacaoClinica = true;
            this.identifiMedico = true;
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
