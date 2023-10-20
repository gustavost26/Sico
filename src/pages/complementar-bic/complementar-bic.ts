import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import {
  NavParams,
  ModalController,
  IonContent,
  NavController,
  AlertController
} from '@ionic/angular';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

// Models
import { BoletimInformacaoClinica } from '../../models/bic-model';

// Sucess Page
import { SucessoBicPageComponent } from '../sucesso-bic/sucesso-bic';

// Components
import { ListModalComponent } from '../../components/list-modal/list-modal';

// Providers
import { MsicoWebServicesProvider } from '../../providers/msico-web-services/msico-web-services';
import { MsicoAlertsProvider } from '../../providers/msico-alerts/msico-alerts';
import { MsicoLoadingProvider } from '../../providers/msico-loading/msico-loading';
import { MsicoGeneratePdfProvider } from '../../providers/msico-generate-pdf/msico-generate-pdf';
import { MsicoWebServicesBicProvider } from '../../providers/msico-web-services-bic/msico-web-services-bic';
import { Router } from '@angular/router';

@Component({
  selector: 'page-complementar-bic',
  templateUrl: 'complementar-bic.html'
})
export class ComplementarBicPageComponent implements OnInit {
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

  // Data Nascimento
  public dataNascimentoInitial;

  // Msg Confirmação
  public msgConfirmacao;

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

  public showCausasMorteConfidenciais = false;

  // Initial List Model
  private initialList = [
    {
      label: '<Escolher>',
      value: ''
    }
  ];

  // selectOptionsSexo
  public selectOptionsSexo = {
    title: 'Sexo'
  };

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
  public concelhoList = this.initialList;
  public freguesiaList = this.initialList;

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

  // Number BIC
  private numBicRetrieved: any;

  // Number CO
  private numCORetrieved: any;

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
      //this.list = this.navParams.get('initialList');
      //this.initialData = this.navParams.get('initialData');

      if (this.router.getCurrentNavigation().extras.state) {
        const params: any = this.router.getCurrentNavigation().extras.state;
  
        this.list = params.initialList;
        this.initialData = params.initialData;
      }
    });

    // If cmConfidenciaisViaCO value is not null, then show info text 'Causas de morte confidenciais'
    if (this.initialData.confidencial) {
      this.showCausasMorteConfidenciais = true;
    }

    this.numBicRetrieved = this.initialData.numBic;

    this.paisList = this.list.listaPais;
    this.distritoList = this.list.listaDistrito;
    this.concelhoList = this.list.listaConcelho;
    this.freguesiaList = this.list.listaFreguesia;

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
      idBic: new FormControl(
        { value: this.initialData.idBic, disabled: this.controlDisable },
        Validators.required
      ),
      idCivil: new FormControl(
        { value: '', disabled: this.controlDisable },
        Validators.required
      ),
      nutente: new FormControl(
        { value: this.initialData.nutente, disabled: this.controlDisable },
        Validators.required
      ),
      nome: new FormControl(
        {
          value: this.initialData.nome,
          disabled: this.controlDisable
        },
        Validators.maxLength(3)
      ),
      nomePai: new FormControl(
        { value: this.initialData.nomePai, disabled: this.controlDisable },
        Validators.required
      ),
      nomeMae: new FormControl(
        { value: this.initialData.nomeMae, disabled: this.controlDisable },
        Validators.required
      ),
      profissao: new FormControl(
        {
          value: this.initialData.profissao,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      chkProfissaoDesconhecida: new FormControl(
        {
          value: this.initialData.chkProfissaoDesconhecida,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      sexo: new FormControl(
        { value: this.initialData.sexo, disabled: this.controlDisable },
        Validators.required
      ),
      diaNascimento: new FormControl(
        {
          value: this.initialData.diaNascimento,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      mesNascimento: new FormControl(
        {
          value: this.initialData.mesNascimento,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      anoNascimento: new FormControl(
        {
          value: this.initialData.anoNascimento,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      dataNascimento: new FormControl(
        {
          value: null,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      estadoCivil: new FormControl(
        {
          value: this.initialData.estadoCivil,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      pais: new FormControl(
        { value: this.initialData.pais, disabled: this.controlDisable },
        Validators.required
      ),
      distrito: new FormControl(
        { value: this.initialData.distrito, disabled: this.controlDisable },
        Validators.required
      ),
      concelho: new FormControl(
        { value: this.initialData.concelho, disabled: this.controlDisable },
        Validators.required
      ),
      freguesia: new FormControl(
        {
          value: this.initialData.freguesia,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      tipoContacto: new FormControl(
        {
          value: this.initialData.tipoContacto,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      contactoFamiliar: new FormControl(
        {
          value: this.initialData.contactoFamiliar,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      infoAdmissao: new FormControl(
        {
          value: this.initialData.infoAdmissao,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      resCovid19: new FormControl(
        {
          value: this.initialData.resCovid19,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      transferidoDe: new FormControl(
        {
          value: this.initialData.transferidoDe,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      dataAdmissaoLocalTransf: new FormControl(
        {
          value: null,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      admitidoInstSaude: new FormControl(
        {
          value: this.initialData.admitidoInstSaude,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      dataAdmissao: new FormControl(
        {
          value: '',
          disabled: this.controlDisable
        },
        Validators.required
      ),
      horaAdmissao: new FormControl(
        {
          value: this.initialData.horaAdmissao,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      chegouCadaver: new FormControl(
        {
          value: this.initialData.chegouCadaver,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      dataFalecido: new FormControl(
        {
          value: '',
          disabled: this.controlDisable
        },
        Validators.required
      ),
      diaFalecido: new FormControl(
        {
          value: '',
          disabled: this.controlDisable
        },
        Validators.required
      ),
      mesFalecido: new FormControl(
        {
          value: '',
          disabled: this.controlDisable
        },
        Validators.required
      ),
      anoFalecido: new FormControl(
        {
          value: '',
          disabled: this.controlDisable
        },
        Validators.required
      ),
      horaFalecido: new FormControl(
        {
          value: this.initialData.horaFalecido,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      dataObito: new FormControl(
        { value: '', disabled: this.controlDisable },
        Validators.required
      ),
      diaObito: new FormControl(
        { value: this.initialData.diaObito, disabled: this.controlDisable },
        Validators.required
      ),
      mesObito: new FormControl(
        { value: this.initialData.mesObito, disabled: this.controlDisable },
        Validators.required
      ),
      anoObito: new FormControl(
        { value: this.initialData.anoObito, disabled: this.controlDisable },
        Validators.required
      ),
      horaObito: new FormControl(
        { value: this.initialData.horaObito, disabled: this.controlDisable },
        Validators.required
      ),
      situacaoClinica: new FormControl(
        {
          value: this.initialData.situacaoClinica,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      internamentoEnf: new FormControl(
        {
          value: this.initialData.internamentoEnf,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      evolucaoClinica: new FormControl(
        {
          value: this.initialData.evolucaoClinica,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      examesComplementares: new FormControl(
        {
          value: this.initialData.examesComplementares,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      antecedentesGerais: new FormControl(
        {
          value: this.initialData.antecedentesGerais,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      diagnostico: new FormControl(
        {
          value: this.initialData.diagnostico,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      terapeuticas: new FormControl(
        {
          value: this.initialData.terapeuticas,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      prodBio: new FormControl(
        { value: this.initialData.prodBio, disabled: this.controlDisable },
        Validators.required
      ),
      vestigios: new FormControl(
        {
          value: this.initialData.vestigios,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      outrosElementos: new FormControl(
        {
          value: this.initialData.outrosElementos,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      observacoes: new FormControl(
        {
          value: this.initialData.observacoes,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      medicoNome: new FormControl(
        {
          value: this.initialData.medicoNome,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      medicoTipoContacto: new FormControl(
        {
          value: '',
          disabled: this.controlDisable
        },
        Validators.required
      ),
      medicoContacto: new FormControl(
        {
          value: '',
          disabled: this.controlDisable
        },
        Validators.required
      ),
      medicoCedulaProf: new FormControl(
        {
          value: this.initialData.medicoCedulaProf,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      operacao: new FormControl({ value: '', disabled: this.controlDisable }),
      msgConfirmacao: new FormControl(
        {
          value: '',
          disabled: this.controlDisable
        },
        Validators.required
      ),
      idCO: new FormControl(
        { value: '', disabled: this.controlDisable },
        Validators.required
      ),
      tipoCO: new FormControl(
        { value: '', disabled: this.controlDisable },
        Validators.required
      ),
      numCO: new FormControl(
        { value: this.initialData.numCO, disabled: this.controlDisable },
        Validators.required
      ),
      titulo: new FormControl(
        { value: '', disabled: this.controlDisable },
        Validators.required
      ),
      numBic: new FormControl(
        { value: this.initialData.numBic, disabled: this.controlDisable },
        Validators.required
      ),
      dataEmissaoComHora: new FormControl(
        {
          value: '',
          disabled: this.controlDisable
        },
        Validators.required
      ),
      dataEmissao: new FormControl(
        {
          value: this.initialData.dataEmissao,
          disabled: true
        },
        Validators.required
      ),
      horaEmissao: new FormControl(
        {
          value: this.initialData.horaEmissao,
          disabled: true
        },
        Validators.required
      ),
      tipoMoradaProfissional: new FormControl(
        {
          value: '',
          disabled: this.controlDisable
        },
        Validators.required
      ),
      moradaProfissionalOutro: new FormControl(
        {
          value: '',
          disabled: this.controlDisable
        },
        Validators.required
      ),
      tipoEntidade: new FormControl(
        {
          value: '',
          disabled: this.controlDisable
        },
        Validators.required
      ),
      codigoSaudeProfissional: new FormControl(
        {
          value: null,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      codigoInmlProfissional: new FormControl(
        {
          value: null,
          disabled: this.controlDisable
        },
        Validators.required
      ),
      tipoServico: new FormControl(
        {
          value: '',
          disabled: this.controlDisable
        },
        Validators.required
      ),
      servicoOutro: new FormControl(
        {
          value: '',
          disabled: this.controlDisable
        },
        Validators.required
      ),
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

    // Dates for fill needs to be parsed
    if (this.initialData.anoNascimento) {
      this.bicForm.patchValue({
        dataNascimento:
          this.initialData.anoNascimento +
          '-' +
          this.pad(this.initialData.mesNascimento, 2, 0) +
          '-' +
          this.pad(this.initialData.diaNascimento, 2, 0)
      });
    }

    if (this.initialData.dataAdmissaoLocalTransf) {
      this.bicForm.patchValue({
        dataAdmissaoLocalTransf:
          this.dateChangeFormat(this.initialData.dataAdmissaoLocalTransf)[2] +
          '-' +
          this.dateChangeFormat(this.initialData.dataAdmissaoLocalTransf)[1] +
          '-' +
          this.dateChangeFormat(this.initialData.dataAdmissaoLocalTransf)[0]
      });
    }

    // Parse the Data Admissao
    if (this.initialData.dataAdmissao) {
      this.bicForm.patchValue({
        dataAdmissao:
          this.dateChangeFormat(this.initialData.dataAdmissao)[2] +
          '-' +
          this.dateChangeFormat(this.initialData.dataAdmissao)[1] +
          '-' +
          this.dateChangeFormat(this.initialData.dataAdmissao)[0]
      });
    }

    if (this.initialData.anoFalecido) {
      this.bicForm.patchValue({
        dataFalecido:
          this.initialData.anoFalecido +
          '-' +
          this.initialData.mesFalecido +
          '-' +
          this.initialData.diaFalecido
      });
    }

    if (this.initialData.anoObito) {
      this.bicForm.patchValue({
        dataObito:
          this.initialData.anoObito +
          '-' +
          this.initialData.mesObito +
          '-' +
          this.initialData.diaObito
      });
    }

    // Pass the idCivil with value
    if (this.initialData.idCivil !== null) {
      this.bicForm.patchValue({ idCivil: this.initialData.idCivil });
    }

    // Booleans
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

    this.dataNascimentoAnoAux = this.initialData.anoNascimento;
    this.dataNascimentoMesAux = this.initialData.mesNascimento;
    this.dataNascimentoDiaAux = this.initialData.diaNascimento;

    this.dataFalecidoAnoAux = this.initialData.anoFalecido;
    this.dataFalecidoMesAux = this.initialData.mesFalecido;
    this.dataFalecidoDiaAux = this.initialData.diaFalecido;

    this.dataObitoAnoAux = this.initialData.anoObito;
    this.dataObitoMesAux = this.initialData.mesObito;
    this.dataObitoDiaAux = this.initialData.diaObito;

    this.dataAdmissaoLocalTransf = this.initialData.dataAdmissaoLocalTransf;
    this.dataAdmissao = this.initialData.dataAdmissao;

    if (this.bicForm.get('dataEmissao').value) {
      let dateString = this.bicForm.get('dataEmissao').value.split('-');
      this.dataPickerMin = (parseInt(dateString[2]) - 8).toString();
    }

    // Check if resCovid19 field is already with "Suspeito" option
    if (this.bicForm.get('resCovid19').value === 'S') {
      this.alertResCovid19SuspeitoAux = true;
    }
  }

  ionViewDidEnter() {
    // Call the Handler of the country
    this.paisHandler();
  }

  onBlur($event): void {
    this.cleanPaintErrors();
    this.cleanPaintAlerts();

    if ($event.value !== undefined && $event.value !== '') {
      this.msicoLoading.onLoading();

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
  clickToTheField(value: any): void {
    let top = document.getElementById(value[0]).offsetTop;

    if (top !== 0) {
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
  parseData(data: any, typeofList: any): void {
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

  dateChangeFormat(value: any) {
    let list: string[];

    list = value.split('-');

    return list;
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

    if (this.bicForm.get('dataNascimento').value !== null &&
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

            if (dataRetrieved.dadosOutput.listaPais) {
              this.list.naturalidadePais = dataRetrieved.dadosOutput.listaPais;
            }
            if (dataRetrieved.dadosOutput.listaDistrito) {
              this.distritoList = dataRetrieved.dadosOutput.listaDistrito;
            }
            if (dataRetrieved.dadosOutput.listaConcelho) {
              this.concelhoList = dataRetrieved.dadosOutput.listaConcelho;
            }
            if (dataRetrieved.dadosOutput.listaFreguesia) {
              this.freguesiaList = dataRetrieved.dadosOutput.listaFreguesia;
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

  populateConcelhoList(): void {
    // Clean data
    this.bicForm.patchValue({ concelho: '' });
    this.bicForm.patchValue({ freguesia: '' });

    this.concelhoList = this.initialList;
    this.freguesiaList = this.initialList;

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
  async dynamicConfirmAlertsMessages(dynamicMessage: any, elementName: string, value: BoletimInformacaoClinica) {
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
    /* if (this.dataAdmissaoLocalTransf === null) {
      this.dataAdmissaoLocalTransf = '';
    } */
    value.dataAdmissaoLocalTransf = this.dataAdmissaoLocalTransf;

    /*If the dataAdmissao is not null then split the value
    into and create an string with the three values to submit*/
    /* if (this.dataAdmissao === null) {
      this.dataAdmissao = '';
    } */
    value.dataAdmissao = this.dataAdmissao;

    let listVerify: any;

    // If the idCivil is not null then remove leading zeros
    if (this.bicForm.get('idCivil').value) {
      value.idCivil = parseInt(value.idCivil.toString(), 10);
      let newValueidCivil = value.idCivil.toString().replace(/^0+/, '');
      this.bicForm.patchValue({ idCivil: newValueidCivil });
    }

    // Call the webservices to validation
    this.msicoWebServices.verifyBIC(value, 'altera').subscribe(
      data => {
        listVerify = data;
        let element: any;

        // If idCivil is sent from from the server then patch value
        if (listVerify.dadosOutput.idCivil) {
          this.bicForm.patchValue({ idCivil: listVerify.dadosOutput.idCivil });
          value.idCivil = listVerify.dadosOutput.idCivil;
        }

        this.msgConfirmacao = listVerify.dadosOutput.msgConfirmacao;

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
    this.bicForm.patchValue({ profissao: '', disable: true });
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
    this.msicoWebServices.submitSucessBIC(this.formParsed, 'altera').subscribe(
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

          // Pass the id of the BIC to sucess
          this.bicForm.patchValue({ idBic: dataRetrieved.dadosOutput.idBic });

          this.navCtrl.navigateForward('sucessoBic', {
            state: {
              operation: 'complementar',
              numBic: this.numBicRetrieved,
              idBic: dataRetrieved.dadosOutput.idBic,
              msgConfirmacao: dataRetrieved.dadosOutput.msgConfirmacao
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
    this.msicoLoading.onLoadingRemove();
    // this.msicoLoading.onLoading();

    // Clean inputs before
    this.bicForm.patchValue({ nome: '' });
    this.bicForm.patchValue({ nomePai: '' });
    this.bicForm.patchValue({ nomeMae: '' });
    this.bicForm.patchValue({ sexo: '' });

    if (this.bicForm.get('dataNascimento').value) {
      this.bicForm.patchValue({
        dataNascimento: null
      });
    }

    this.dataNascimentoAnoAux = '';
    this.dataNascimentoMesAux = '';
    this.dataNascimentoDiaAux = '';

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
            dataRetrieved.dadosOutput.anoNascimento != null &&
            dataRetrieved.dadosOutput.mesNascimento != null &&
            dataRetrieved.dadosOutput.diaNascimento != null
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
    // Create loading
    this.msicoLoading.onLoadingRemove();
    //  this.msicoLoading.onLoading();

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
        this.initialData.idBic,
        'altera',
        this.initialData.numBic
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
            dataRetrieved.dadosOutput.anoNascimento != null &&
            dataRetrieved.dadosOutput.mesNascimento != null &&
            dataRetrieved.dadosOutput.diaNascimento != null
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

          if (dataRetrieved.dadosOutput.pais) {
            // List Pais Naturalidade
            this.paisList = dataRetrieved.dadosOutput.listaPais;

            this.bicForm.patchValue({ pais: dataRetrieved.dadosOutput.pais });

            this.paisHandler();
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
