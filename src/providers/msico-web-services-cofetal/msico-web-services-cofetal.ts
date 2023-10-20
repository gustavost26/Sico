import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParametersInterface } from '../../models/parameters-model';
import { MsicoEnviromentAccessProvider } from '../../providers/msico-enviroment-access/msico-enviroment-access';
import { MsicoHeadersProvider } from '../../providers/msico-headers/msico-headers';
import { delay } from 'rxjs';

const timeToTimeOut: number = 60000;

@Injectable()
export class MsicoWebServicesCofetalProvider {
  constructor(
    public http: HttpClient,
    private msicoEnviromentAccessProvider: MsicoEnviromentAccessProvider,
    private msicoHeadersProvider: MsicoHeadersProvider
  ) {}

  /*********************************************************************
   ***                      LIST CO FETAL
   **********************************************************************/
  loadListCOFetal(
    NCO: string,
    nic: string,
    numUtente: string,
    nomeFalecido: string,
    localObito: string,
    hospitalObito: string,
    outroLocal: string,
    dataInicioObito: string,
    dataFimObito: string,
    dataInicioCertificacao: string,
    dataFimCertificacao: string,
    tipooperacao: string
  ) {
    // Data to pass
    let data: ParametersInterface = {
      numCO: NCO
    };
    let jsonObj = JSON.stringify(data);

    const getListagemCOUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_fetal/getCOFetalListagem?operacao=' +
      tipooperacao +
      '&criteriosPesquisa=';

    return this.http
      .get(getListagemCOUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*********************************************************************
   ***                      DETAILS CO FETAL
   **********************************************************************/
  loadDetailsCOFetalDetails(idcofetal: any, tipooperacao: string) {
    const getListagemCOUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_fetal/getCOFetal?operacao=' +
      tipooperacao +
      '&idco=';

    return this.http
      .get(getListagemCOUrl + idcofetal, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*********************************************************************
   ***                   INITIAL DATA CO FETAL
   **********************************************************************/
  getInitialDataCOFetalServices() {
    const getDadosInicialCOFetal =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_fetal/getDadosIniciaisCOFetal';
    return this.http
      .get(getDadosInicialCOFetal, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        DOMAIN LIST CO FETAL
   *****************************************************************************************************************/
  getTotalDomainListCOFetalServices(
    mode: any,
    obitoAno: any,
    obitoMes: any,
    obitoDia: any,
    distritoLocalObito: any,
    concelhoLocalObito: any,
    distritoResidencia: any,
    concelhoResidencia: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any
  ) {
    const getListagemDominioTotalCOFetalUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_fetal/getListDomTotalCOFetal?' +
      'tipoOperacao=' +
      mode +
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
      'distritoLocalObito=' +
      distritoLocalObito +
      '&' +
      'concelhoLocalObito=' +
      concelhoLocalObito +
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

    return this.http
      .get(getListagemDominioTotalCOFetalUrl, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST CO FETAL
   *****************************************************************************************************************/
  getListagemFetalEspecificaLocalObitoDistritoServices(
    anoNascimento: any,
    mesNascimento: any,
    diaNascimento: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any
  ) {
    // Data to pass
    let data: ParametersInterface = {
      anoObito: anoNascimento,
      mesObito: mesNascimento,
      diaObito: diaNascimento,
      anoEmissao: anoEmissao,
      mesEmissao: mesEmissao,
      diaEmissao: diaEmissao
    };

    let jsonObj = JSON.stringify(data);

    const getListagemCOFetalUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_fetal/getListDomEspecificaCOFetal?nomeListagem=LocalObitoDistrito&parametrosJson=';

    return this.http
      .get(getListagemCOFetalUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST CO FETAL
   *****************************************************************************************************************/
  getSpecificFetalListLocalObitoConcelhoServices(
    anoObito: any,
    mesObito: any,
    diaObito: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any,
    distritoObito: any
  ) {
    // Data to pass
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
    const getListagemCOFetalUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_fetal/getListDomEspecificaCOFetal?nomeListagem=LocalObitoConcelho&parametrosJson=';

    return this.http
      .get(getListagemCOFetalUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST CO FETAL
   *****************************************************************************************************************/
  getSpecificFetalListLocalObitoFreguesiaServices(
    anoObito: any,
    mesObito: any,
    diaObito: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any,
    distritoObito: any,
    concelhoObito: any
  ) {
    // Data to pass
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
    const getListagemCOFetalUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_fetal/getListDomEspecificaCOFetal?nomeListagem=LocalObitoFreguesia&parametrosJson=';

    return this.http
      .get(getListagemCOFetalUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST CO FETAL
   *****************************************************************************************************************/
  getListagemFetalEspecificaResidenciaDistritoServices(
    anoObito: any,
    mesObito: any,
    diaObito: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any
  ) {
    // Data to pass
    let data: ParametersInterface = {
      anoObito: anoObito,
      mesObito: mesObito,
      diaObito: diaObito,
      anoEmissao: anoEmissao,
      mesEmissao: mesEmissao,
      diaEmissao: diaEmissao
    };

    let jsonObj = JSON.stringify(data);
    const getListagemCOFetalUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_fetal/getListDomEspecificaCOFetal?nomeListagem=ResidenciaDistrito&parametrosJson=';

    return this.http
      .get(getListagemCOFetalUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST CO FETAL
   *****************************************************************************************************************/
  getSpecificFetalListResidenciaConcelhoServices(
    anoObito: any,
    mesObito: any,
    diaObito: any,
    anoEmissao: any,
    mesEmissao: any,
    diaEmissao: any,
    distritoResidencia: any
  ) {
    // Data to pass
    let data: ParametersInterface = {
      anoObito: anoObito,
      mesObito: mesObito,
      diaObito: diaObito,
      anoEmissao: anoEmissao,
      mesEmissao: mesEmissao,
      diaEmissao: diaEmissao,
      distritoResidencia: distritoResidencia
    };

    let jsonObj = JSON.stringify(data);
    const getListagemCOFetalUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_fetal/getListDomEspecificaCOFetal?nomeListagem=ResidenciaConcelho&parametrosJson=';

    return this.http
      .get(getListagemCOFetalUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST CO FETAL
   *****************************************************************************************************************/
  getSpecificFetalListResidenciaFreguesiaServices(
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
    const getListagemCOFetalUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_fetal/getListDomEspecificaCOFetal?nomeListagem=ResidenciaFreguesia&parametrosJson=';

    return this.http
      .get(getListagemCOFetalUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST CO FETAL
   *****************************************************************************************************************/
  getListDomEspecificoCOFetalDataObitoServices(
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
    // Data to pass
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
    const getListagemCOFetalUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_fetal/getListDomEspecificaCOFetal?nomeListagem=DataObitoAlterada&parametrosJson=';

    return this.http
      .get(getListagemCOFetalUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        VALIDATION CO FETAL
   *****************************************************************************************************************/
  verifyCOFetal(formData: any, tipooperacao: string) {
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
          '/co_fetal/validaCOFetal',
        body,
        {
          headers: this.msicoHeadersProvider.getHeaders()
        }
      )
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SUBMISSION CO Fetal
   *****************************************************************************************************************/
  submitSucessCOFetal(formData: any, tipoOperacao: string) {
    let jsonObj = JSON.stringify(formData);
    let body =
      'operacao=' + tipoOperacao + '&dadosco=' + encodeURIComponent(jsonObj);

    return this.http
      .post(
        this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
          '/co_fetal/submeteCOFetal',
        body,
        {
          headers: this.msicoHeadersProvider.getHeaders()
        }
      )
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        GET DATA BIC CO FETAL
   *****************************************************************************************************************/
  getDadosBicCOFetal(
    numBIC: any,
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
    const getDadosBicCOFetal =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_fetal/getDadosBicCOFetal?numBIC=' +
      numBIC +
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
      .get(getDadosBicCOFetal, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        GET DATA FALECIDO CO FETAL
   *****************************************************************************************************************/
  getDadosFalecidoCOFetal(numUtente: any, numBI: any) {
    if (numUtente === null) {
      numUtente = '';
    }

    if (numBI === null) {
      numBI = '';
    }

    const getDadosFalecidoCOFetal =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_fetal/getDadosFalecidoCOFetal?numBI=' +
      numBI +
      '&' +
      'numUtente=' +
      numUtente;
    return this.http
      .get(getDadosFalecidoCOFetal, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        GET CO FETAL PDF
   *****************************************************************************************************************/
  getCOFetalPdf64(idcoNumber: any, nomeTemplate: any) {
    const getCOFetalPdf64 =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_fetal/getCOFetalPdf64?idco=' +
      idcoNumber +
      '&nomeTemplate=' +
      nomeTemplate;

    return this.http
      .get(getCOFetalPdf64, { headers: this.msicoHeadersProvider.getHeaders() })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        GET FICHA INEM PDF CO FETAL
   *****************************************************************************************************************/
  getCOFetalFichaInemPdf64(numCodu: any) {
    const getCOFetalFichaInemPdf64 =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/co_fetal/getCOFetalFichaInemPdf64?numCodu=' +
      numCodu;
    return this.http
      .get(getCOFetalFichaInemPdf64, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }
}
