import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParametersInterface } from '../../models/parameters-model';
import { MsicoEnviromentAccessProvider } from '../../providers/msico-enviroment-access/msico-enviroment-access';
import { MsicoHeadersProvider } from '../../providers/msico-headers/msico-headers';
import { delay } from 'rxjs';

const timeToTimeOut: number = 60000;

@Injectable()
export class MsicoWebServicesBicProvider {
  constructor(
    public http: HttpClient,
    private msicoEnviromentAccessProvider: MsicoEnviromentAccessProvider,
    private msicoHeadersProvider: MsicoHeadersProvider
  ) {}

  /*********************************************************************
   ***                      List BIC
   **********************************************************************/
  loadListBIC(NBIC: any, nic: any, numUtente: any, nomeFalecido: any, tipooperacao: any) {
    // Data to pass
    let data: ParametersInterface = {
      numBIC: NBIC
      //      nic: nic,
      //     numUtente: numUtente,
      //     nomeFalecido: nomeFalecido
    };
    let jsonObj = JSON.stringify(data);

    const getListagemBICUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/bic/getBICListagem?operacao=' +
      tipooperacao +
      '&criteriosPesquisa=';
    return this.http
      .get(getListagemBICUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*********************************************************************
   ***                      DETAILS BIC
   **********************************************************************/
  loadDetailsBICDetails(idbic: any, tipooperacao: any, versao?: any) {
    if (!versao) {
      versao = '';
    }
    const getListagemBICUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/bic/getBIC?operacao=' +
      tipooperacao +
      '&idBic=' +
      idbic +
      '&versao=' +
      versao;
    return this.http
      .get(getListagemBICUrl, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*********************************************************************
   ***                   INITIAL DATA BIC
   **********************************************************************/
  getInitialDataBICServices() {
    const getDadosInicialBIC =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/bic/getDadosIniciaisBIC';
    return this.http
      .get(getDadosInicialBIC, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        DOMAIN LIST BIC (BIC_CRIAR)
   *****************************************************************************************************************/
  getTotalDomainListBICServices(
    mode: any,
    anoNascimento: any,
    mesNascimento: any,
    diaNascimento: any,
    distrito: any,
    concelho: any,
    anoObito: any,
    mesObito: any,
    diaObito: any
  ) {
    const getListagemDominioTotalBICUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/bic/getListDomTotalBIC?' +
      'tipoOperacao=' +
      mode +
      '&' +
      'anoNascimento=' +
      anoNascimento +
      '&' +
      'mesNascimento=' +
      mesNascimento +
      '&' +
      'diaNascimento=' +
      diaNascimento +
      '&' +
      'distrito=' +
      distrito +
      '&' +
      'concelho=' +
      concelho +
      '&' +
      'anoObito=' +
      anoObito +
      '&' +
      'mesEmissao=' +
      mesObito +
      '&' +
      'mesObito=' +
      diaObito;

    return this.http
      .get(getListagemDominioTotalBICUrl, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST BIC
   *****************************************************************************************************************/
  getListagemBICEspecificaNaturalidadeDistritoServices(
    anoNascimento: any,
    mesNascimento: any,
    diaNascimento: any,
    anoObito: any,
    mesObito: any,
    diaObito: any
  ) {
    // Data to pass
    let data: ParametersInterface = {
      anoNascimento: anoNascimento,
      mesNascimento: mesNascimento,
      diaNascimento: diaNascimento,
      anoObito: anoObito,
      mesObito: mesObito,
      diaObito: diaObito
    };

    let jsonObj = JSON.stringify(data);
    const getListagemBICUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/bic/getListDomEspecificaBIC?nomeListagem=NaturalidadeDistrito&parametrosJson=';

    return this.http
      .get(getListagemBICUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST BIC
   *****************************************************************************************************************/
  getSpecificBICListNaturalidadeConcelhoServices(
    anoNascimento: any,
    mesNascimento: any,
    diaNascimento: any,
    distrito: any,
    anoObito: any,
    mesObito: any,
    diaObito: any
  ) {
    // Data to pass
    let data: ParametersInterface = {
      anoNascimento: anoNascimento,
      mesNascimento: mesNascimento,
      diaNascimento: diaNascimento,
      distrito: distrito,
      anoObito: anoObito,
      mesObito: mesObito,
      diaObito: diaObito
    };

    let jsonObj = JSON.stringify(data);
    const getListagemBICUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/bic/getListDomEspecificaBIC?nomeListagem=NaturalidadeConcelho&parametrosJson=';

    return this.http
      .get(getListagemBICUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST BIC
   *****************************************************************************************************************/
  getSpecificListBICNaturalidadeFreguesiaServices(
    anoNascimento: any,
    mesNascimento: any,
    diaNascimento: any,
    distrito: any,
    concelho: any,
    anoObito: any,
    mesObito: any,
    diaObito: any
  ) {
    // Data to pass
    let data: ParametersInterface = {
      anoNascimento: anoNascimento,
      mesNascimento: mesNascimento,
      diaNascimento: diaNascimento,
      distrito: distrito,
      concelho: concelho,
      anoObito: anoObito,
      mesObito: mesObito,
      diaObito: diaObito
    };

    let jsonObj = JSON.stringify(data);
    const getListagemBICUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/bic/getListDomEspecificaBIC?nomeListagem=NaturalidadeFreguesia&parametrosJson=';

    return this.http
      .get(getListagemBICUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SPECIFIC LIST BIC
   *****************************************************************************************************************/
  getListagemBICEspecificaDataNascimentoAlteradaServices(
    anoNascimento: any,
    mesNascimento: any,
    diaNascimento: any,
    distrito: any,
    concelho: any,
    anoObito: any,
    mesObito: any,
    diaObito: any
  ) {
    // Data to pass
    let data: ParametersInterface = {
      anoNascimento: anoNascimento,
      mesNascimento: mesNascimento,
      diaNascimento: diaNascimento,
      distrito: distrito,
      concelho: concelho,
      anoObito: anoObito,
      mesObito: mesObito,
      diaObito: diaObito
    };

    let jsonObj = JSON.stringify(data);
    const getListagemBICUrl =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/bic/getListDomEspecificaBIC?nomeListagem=DataNascimentoAlterada&parametrosJson=';

    return this.http
      .get(getListagemBICUrl + jsonObj, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        VALIDATION BIC
   *****************************************************************************************************************/
  verifyBIC(formData: any, operacao: any) {
    let jsonObj = JSON.stringify(formData);
    let body =
      'operacao=' + operacao + '&dadosbic=' + encodeURIComponent(jsonObj);

    return this.http
      .post(
        this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
          '/bic/validaBIC',
        body,
        {
          headers: this.msicoHeadersProvider.getHeaders()
        }
      )
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        SUBMISSION BIC
   *****************************************************************************************************************/
  submitSucessBIC(formData: any, operacao: any) {
    let jsonObj = JSON.stringify(formData);
    let body =
      'operacao=' + operacao + '&dadosbic=' + encodeURIComponent(jsonObj);

    return this.http
      .post(
        this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
          '/bic/submeteBIC',
        body,
        {
          headers: this.msicoHeadersProvider.getHeaders()
        }
      )
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        GET DATA CO BIC
   *****************************************************************************************************************/
  getDataCOBic(
    numCO: any,
    nUtente: any,
    idCivil: any,
    anoNascimento: any,
    mesNascimento: any,
    diaNascimento: any,
    anoObito: any,
    mesObito: any,
    diaObito: any,
    idBic: any,
    operacao: any,
    numBic: any
  ) {
    if (nUtente === null) {
      nUtente = '';
    }

    if (idCivil === null) {
      idCivil = '';
    }

    if (numCO === null) {
      numCO = '';
    }

    if (numBic === null) {
      numBic = '';
    }

    if (idBic === null) {
      idBic = '';
    }

    const getDadosCOBic =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/bic/getDadosCOBic?numCO=' +
      numCO +
      '&' +
      'nUtente=' +
      nUtente +
      '&' +
      'idCivil=' +
      idCivil +
      '&' +
      'anoNascimento=' +
      anoNascimento +
      '&' +
      'mesNascimento=' +
      mesNascimento +
      '&' +
      'diaNascimento=' +
      diaNascimento +
      '&' +
      'anoObito=' +
      anoObito +
      '&' +
      'mesObito=' +
      mesObito +
      '&' +
      'diaObito=' +
      diaObito +
      '&' +
      'idBic=' +
      idBic +
      '&' +
      'numBic=' +
      numBic +
      '&' +
      'operacao=' +
      operacao;

    return this.http
      .get(getDadosCOBic, { headers: this.msicoHeadersProvider.getHeaders() })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        GET DATA FALECIDO BIC
   *****************************************************************************************************************/
  getDadosFalecidoBIC(
    numUtente: any,
    idCivil: any,
    anoObito: any,
    mesObito: any,
    diaObito: any
  ) {
    if (numUtente === null) {
      numUtente = '';
    }

    if (idCivil === null) {
      idCivil = '';
    }

    const getDadosFalecidoBIC =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/bic/getDadosFalecidoBIC?idCivil=' +
      idCivil +
      '&' +
      'nUtente=' +
      numUtente +
      '&' +
      'anoObito=' +
      anoObito +
      '&' +
      'mesObito=' +
      mesObito +
      '&' +
      'diaObito=' +
      diaObito;

    return this.http
      .get(getDadosFalecidoBIC, {
        headers: this.msicoHeadersProvider.getHeaders()
      })
      .pipe(delay(timeToTimeOut));  }

  /*****************************************************************************************************************
   ***                                        GET BIC PDF
   *****************************************************************************************************************/
  getBicPdf64(idcoNumber: any, nomeTemplate: any, versao?: any) {
    if (!versao) {
      versao = '';
    }
    const getBicPdf64 =
      this.msicoEnviromentAccessProvider.getCurrentEnviroment() +
      '/bic/getBicPdf64?idBic=' +
      idcoNumber +
      '&nomeTemplate=' +
      nomeTemplate +
      '&versao=' +
      versao;
    return this.http
      .get(getBicPdf64, { headers: this.msicoHeadersProvider.getHeaders() })
      .pipe(delay(timeToTimeOut));
  }
}
