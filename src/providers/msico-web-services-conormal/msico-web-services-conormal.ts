import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MsicoHeadersProvider } from '../../providers/msico-headers/msico-headers';
import { MsicoAuthtokenProvider } from '../../providers/msico-authtoken/msico-authtoken';
import { ParametersInterface } from '../../models/parameters-model';
import { MsicoEnviromentAccessProvider } from '../../providers/msico-enviroment-access/msico-enviroment-access';
import { delay } from 'rxjs';

const timeToTimeOut: number = 60000;

@Injectable()
export class MsicoWebServicesConormalProvider {
  constructor(
    public http: HttpClient,
    private msicoAuthtoken: MsicoAuthtokenProvider,
    private msicoEnviromentAccessProvider: MsicoEnviromentAccessProvider,
    private msicoHeadersProvider: MsicoHeadersProvider
  ) {}

  /*********************************************************************
   ***                      LIST CO NORMAL
   **********************************************************************/
  loadListCO(
    NCO: any,
    nic: any,
    numUtente: any,
    nomeFalecido: any,
    localObito: any,
    hospitalObito: any,
    outroLocal: any,
    dataInicioObito: any,
    dataFimObito: any,
    dataInicioCertificacao: any,
    dataFimCertificacao: any,
    tipooperacao: string
  ) {
    let data: ParametersInterface = {
      numCO: NCO
      //      nic: nic,
      //      numUtente: numUtente,
      //      nome: nomeFalecido,
      //      localObito: localObito,
      //      hospitalObito: hospitalObito,
      //      outroLocal: outroLocal,
      //      dataInicioObito: dataInicioObito,
      //      dataFimObito: dataFimObito,
      //      dataInicioCertificacao: dataInicioCertificacao,
      //      dataFimCertificacao: dataFimCertificacao
    };

    let jsonObj = JSON.stringify(data);

    const getListagemCOUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_normal/getCONormalListagem?operacao=' +
      tipooperacao +
      '&criteriosPesquisa=';

    return this.http
      .get(getListagemCOUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*********************************************************************
   **********************************************************************/
  loadDetailsCO(idco: any, tipooperacao: any) {
    const getListagemCOUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_normal/getCONormal?operacao=' +
      tipooperacao +
      '&idco=';
    return this.http
      .get(getListagemCOUrl + idco, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*********************************************************************
   ***                   INITIAL DATA CO NORMAL
   **********************************************************************/
  getInitialDataCONormalServices() {
    const getDadosIniciaisCONormal =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_normal/getDadosIniciaisCONormal';

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'application/json; charset=utf-8')
      .set('tokenAuth', this.msicoAuthtoken.getToken());

    return this.http
      .get(getDadosIniciaisCONormal, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                         DOMAIN LIST CO NORMAL
   *****************************************************************************************************************/
  getTotalDomainListCONormalServices(
    mode: any,
    obitoMes: any,
    obitoDia: any,
    distritoLocalObito: any,
    concelhoLocalObito: any,
    nascimentoAno: any,
    nascimentoMes: any,
    nascimentoDia: any,
    distritoNaturalidade: any,
    concelhoNaturalidade: any,
    distritoResidencia: any,
    concelhoResidencia: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any
  ) {
    // URL Listagem CO
    const getListagemDominioTotalCOUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_normal/getListDomTotalCONormal?' +
      'tipoOperacao=' +
      mode +
      '&' +
      'obitoMes=' +
      obitoMes +
      '&' +
      'obitoDia=' +
      obitoDia +
      '&' +
      'distritoLocalObito=' +
      distritoLocalObito +
      '&' +
      'concelhoLocalObito=' +
      concelhoLocalObito +
      '&' +
      'nascimentoAno=' +
      nascimentoAno +
      '&' +
      'nascimentoMes=' +
      nascimentoMes +
      '&' +
      'nascimentoDia=' +
      nascimentoDia +
      '&' +
      'distritoNaturalidade=' +
      distritoNaturalidade +
      '&' +
      ' concelhoNaturalidade=' +
      concelhoNaturalidade +
      '&' +
      'distritoResidencia=' +
      distritoResidencia +
      '&' +
      'concelhoResidencia=' +
      concelhoResidencia +
      '&' +
      'anoEmissao=' +
      anoEmissao +
      '&' +
      'mesEmissao=' +
      mesEmissao +
      '&' +
      'diaEmissao=' +
      diaEmissao;

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'application/json; charset=utf-8')
      .set('tokenAuth', this.msicoAuthtoken.getToken());

    return this.http
      .get(getListagemDominioTotalCOUrl, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST CO NORMAL
   *****************************************************************************************************************/
  getListSpecificNaturalidadeFreguesiaServices(
    anoNascimento: any,
    mesNascimento: any,
    diaNascimento: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any,
    distritoNaturalidade: any,
    concelhoNaturalidade: any
  ) {
    // Data to pass
    let data: ParametersInterface = {
      anoNascimento: anoNascimento,
      mesNascimento: mesNascimento,
      diaNascimento: diaNascimento,
      anoEmissao: anoEmissao,
      mesEmissao: mesEmissao,
      diaEmissao: diaEmissao,
      distritoNaturalidade: distritoNaturalidade,
      concelhoNaturalidade: concelhoNaturalidade
    };

    let jsonObj = JSON.stringify(data);

    const getListagemCOUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_normal/getListDomEspecificaCONormal?nomeListagem=NaturalidadeFreguesia&parametrosJson=';
    return this.http
      .get(getListagemCOUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST CO NORMAL
   *****************************************************************************************************************/
  getListSpecificLocalObitoConcelhoServices(
    anoObito: any,
    mesObito: any,
    diaObito: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any,
    distritoObito: any
  ) {
    let data: ParametersInterface = {
      anoObito: anoObito,
      mesObito: mesObito,
      diaObito: diaObito,
      anoEmissao: anoEmissao,
      mesEmissao: mesEmissao,
      diaEmissao: diaEmissao,
      distritoObito: distritoObito
    };

    let jsonObj = JSON.stringify(data);

    const getListagemCOUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_normal/getListDomEspecificaCONormal?nomeListagem=LocalObitoConcelho&parametrosJson=';

    return this.http
      .get(getListagemCOUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST CO NORMAL
   *****************************************************************************************************************/
  getListSpecificLocalObitoFreguesiaServices(
    anoObito: any,
    mesObito: any,
    diaObito: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any,
    distritoObito: any,
    concelhoObito: any
  ) {
    let data: ParametersInterface = {
      anoObito: anoObito,
      mesObito: mesObito,
      diaObito: diaObito,
      anoEmissao: anoEmissao,
      mesEmissao: mesEmissao,
      diaEmissao: diaEmissao,
      distritoObito: distritoObito,
      concelhoObito: concelhoObito
    };

    let jsonObj = JSON.stringify(data);

    const getListagemCOUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_normal/getListDomEspecificaCONormal?nomeListagem=LocalObitoFreguesia&parametrosJson=';

    return this.http
      .get(getListagemCOUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST CO NORMAL
   *****************************************************************************************************************/
  getListSpecificNaturalidadeDistritoServices(
    distritoNaturalidade: any,
    anoNascimento: any,
    mesNascimento: any,
    diaNascimento: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any
  ) {
    // Data to pass
    let data: ParametersInterface = {
      distritoNaturalidade: distritoNaturalidade,
      anoNascimento: anoNascimento,
      mesNascimento: mesNascimento,
      diaNascimento: diaNascimento,
      anoEmissao: anoEmissao,
      mesEmissao: mesEmissao,
      diaEmissao: diaEmissao
    };

    let jsonObj = JSON.stringify(data);

    const getListagemCOUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_normal/getListDomEspecificaCONormal?nomeListagem=NaturalidadeConcelho&parametrosJson=';

    return this.http
      .get(getListagemCOUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST CO NORMAL
   *****************************************************************************************************************/
  getListSpecificResidenciaConcelhoServices(
    anoObito: any,
    mesObito: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any,
    diaObito: any,
    distritoResidencia: any
  ) {
    // Data to pass
    let data: ParametersInterface = {
      anoObito: anoObito,
      mesObito: mesObito,
      anoEmissao: anoEmissao,
      mesEmissao: mesEmissao,
      diaEmissao: diaEmissao,
      diaObito: diaObito,
      distritoResidencia: distritoResidencia
    };

    let jsonObj = JSON.stringify(data);
    const getListagemCOUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_normal/getListDomEspecificaCONormal?nomeListagem=ResidenciaConcelho&parametrosJson=';

    return this.http
      .get(getListagemCOUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST CO NORMAL
   *****************************************************************************************************************/
  getListSpecificResidenciaFreguesiaServices(
    anoObito: any,
    mesObito: any,
    diaObito: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any,
    distritoResidencia: any,
    concelhoResidencia: any
  ) {
    // Data to pass
    let data: ParametersInterface = {
      anoObito: anoObito,
      mesObito: mesObito,
      diaObito: diaObito,
      anoEmissao: anoEmissao,
      mesEmissao: mesEmissao,
      diaEmissao: diaEmissao,
      distritoResidencia: distritoResidencia,
      concelhoResidencia: concelhoResidencia
    };

    let jsonObj = JSON.stringify(data);
    const getListagemCOUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_normal/getListDomEspecificaCONormal?nomeListagem=ResidenciaFreguesia&parametrosJson=';

    return this.http
      .get(getListagemCOUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST CO NORMAL
   *****************************************************************************************************************/
  getListDomSpecificCONormalDataNascimentoServices(
    anoNascimento: any,
    mesNascimento: any,
    diaNascimento: any,
    distritoNaturalidade: any,
    concelhoNaturalidade: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any
  ) {
    let data: ParametersInterface = {
      anoNascimento: anoNascimento,
      mesNascimento: mesNascimento,
      diaNascimento: diaNascimento,
      distritoNaturalidade: distritoNaturalidade,
      concelhoNaturalidade: concelhoNaturalidade,
      anoEmissao: anoEmissao,
      mesEmissao: mesEmissao,
      diaEmissao: diaEmissao
    };

    console.log('WEB SERVICE concelhoNaturalidade: ' , concelhoNaturalidade);

    let jsonObj = JSON.stringify(data);
    const getListagemCOUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_normal/getListDomEspecificaCONormal?nomeListagem=DataNascimentoAlterada&parametrosJson=';

    return this.http
      .get(getListagemCOUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST CO NORMAL
   *****************************************************************************************************************/
  getListDomSpecificCONormalDataObitoServices(
    anoObito: any,
    mesObito: any,
    diaObito: any,
    distritoObito: any,
    concelhoObito: any,
    distritoResidencia: any,
    concelhoResidencia: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any
  ) {
    let data: ParametersInterface = {
      anoObito: anoObito,
      mesObito: mesObito,
      diaObito: diaObito,
      distritoObito: distritoObito,
      concelhoObito: concelhoObito,
      distritoResidencia: distritoResidencia,
      concelhoResidencia: concelhoResidencia,
      anoEmissao: anoEmissao,
      mesEmissao: mesEmissao,
      diaEmissao: diaEmissao
    };

    let jsonObj = JSON.stringify(data);
    const getListagemCOUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_normal/getListDomEspecificaCONormal?nomeListagem=DataObitoAlterada&parametrosJson=';

    return this.http
      .get(getListagemCOUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        VALIDATION CO NORMAL
   *****************************************************************************************************************/
  verifyCO(formData: any, tipooperacao: any) {
    let jsonObj = JSON.stringify(formData);
    let body =
      'operacao=' +
      tipooperacao +
      '&' +
      'dadosco=' +
      encodeURIComponent(jsonObj);

    return this.http
      .post(
        this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
            '/co_normal/validaCONormal',
        body,
        {
          headers: this.msicoHeadersProvider.getHeaders()
        }
      )
      .pipe(delay(timeToTimeOut));
  }

  /*****************************************************************************************************************
   ***                                        SUBMISSION CO NORMAL
   *****************************************************************************************************************/
  submitSucessCONormal(formData: any, tipoOperacao: any) {
    let jsonObj = JSON.stringify(formData);
    let body =
      'operacao=' + tipoOperacao + '&dadosco=' + encodeURIComponent(jsonObj);

    return this.http
      .post(
        this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
          '/co_normal/submeteCONormal',
        body,
        {
          headers: this.msicoHeadersProvider.getHeaders()
        }
      )
      .pipe(delay(timeToTimeOut));
  }

  /*****************************************************************************************************************
   ***                                        GET DATA BIC CO NORMAL
   *****************************************************************************************************************/
  getDadosBicCONormal(
    numBIC: any,
    nascimentoAno: any,
    nascimentoMes: any,
    nascimentoDia: any,
    obitoAno: any,
    obitoMes: any,
    obitoDia: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any,
    tipoOperacao: string,
    idco: string,
    numCertificado: string
  ) {
    if (numBIC === null) {
      numBIC = '';
    }

    if (idco === null) {
      idco = '';
    }

    if (numCertificado === null) {
      numCertificado = '';
    }
    const getDadosBicCONormal =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_normal/getDadosBicCONormal?numBIC=' +
      numBIC +
      '&' +
      'nascimentoAno=' +
      nascimentoAno +
      '&' +
      'nascimentoMes=' +
      nascimentoMes +
      '&' +
      'nascimentoDia=' +
      nascimentoDia +
      '&' +
      'obitoAno=' +
      obitoAno +
      '&' +
      'obitoMes=' +
      obitoMes +
      '&' +
      'obitoDia=' +
      obitoDia +
      '&' +
      'anoEmissao=' +
      anoEmissao +
      '&' +
      'mesEmissao=' +
      mesEmissao +
      '&' +
      'diaEmissao=' +
      diaEmissao +
      '&' +
      'operacao=' +
      tipoOperacao +
      '&' +
      'idco=' +
      idco +
      '&' +
      'numCertificado=' +
      numCertificado;

    return this.http
      .get(getDadosBicCONormal, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));
  }

  /*****************************************************************************************************************
   ***                                        GET DATA FALECIDO CO NORMAL
   *****************************************************************************************************************/
  getDataFalecidoCONormal(
    numUtente: any,
    numBI: any,
    obitoAno: any,
    obitoMes: any,
    obitoDia: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any
  ) {
    if (numUtente === null) {
      numUtente = '';
    }

    if (numBI === null) {
      numBI = '';
    }

    const getDadosFalecidoCONormal =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_normal/getDadosFalecidoCONormal?numUtente=' +
      numUtente +
      '&' +
      'numBI=' +
      numBI +
      '&' +
      'obitoAno=' +
      obitoAno +
      '&' +
      'obitoMes=' +
      obitoMes +
      '&' +
      'obitoDia=' +
      obitoDia +
      '&' +
      'anoEmissao=' +
      anoEmissao +
      '&' +
      'mesEmissao=' +
      mesEmissao +
      '&' +
      'diaEmissao=' +
      diaEmissao;

    return this.http
      .get(getDadosFalecidoCONormal, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));
  }

  /*****************************************************************************************************************
   ***                                        GET CO NORMAL PDF
   *****************************************************************************************************************/
  getCONormalPdf64(idcoNumber: any, nomeTemplate: any) {
    const getCONormalPdf64 =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_normal/getCONormalPdf64?idco=' +
      idcoNumber +
      '&nomeTemplate=' +
      nomeTemplate;
    return this.http
      .get(getCONormalPdf64, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));
  }

  /*****************************************************************************************************************
   ***                                        GET FICHA INEM PDF CO NORMAL
   *****************************************************************************************************************/
  getCONormalFichaInemPdf64(numCodu: any) {
    const getCONormalFichaInemPdf64 =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_normal/getCONormalFichaInemPdf64?numCodu=' +
      numCodu;
    return this.http
      .get(getCONormalFichaInemPdf64, {
        headers: this.msicoHeadersProvider.getHeaders()
      }).pipe(delay(timeToTimeOut));
  }
}
