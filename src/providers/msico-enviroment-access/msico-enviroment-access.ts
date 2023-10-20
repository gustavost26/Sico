import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class MsicoEnviromentAccessProvider {
  private targetEnviroment: any;

  // LocalHost
  readonly linkurlLocalHost = 'http://172.21.13.33:7101/SICO_Servicos/sicoServlet';

  readonly linkUrlLocalHostWifi = 'http://172.21.94.78:7101/SICO_Servicos/sicoServlet';

  // Server DEV
  readonly linkurlDev = 'http://192.168.4.193:8021/SICO_Servicos/sicoServlet';

  // Server Testes
  readonly linkurlTestes = 'http://192.168.4.193:8021/SICO_Servicos_Teste/sicoServlet';

  // Server Qualidade - Interno
  readonly linkurlQAInt = 'http://10.202.229.211:7003/SICO_Servicos/sicoServlet';

  // Server Qualidade - Externo
  readonly linkurlQA = 'https://sicomobileqa.min-saude.pt/SICO_Servicos/sicoServlet';

  // Server Produção
  readonly linkurlProd = 'https://sicomobile.min-saude.pt/SICO_Servicos/sicoServlet';

  // Server Pre-Produção Int
  readonly linkurlPreProdInt = 'http://10.202.229.211:7003/SICO_ServicosPreProd/sicoServlet';

  // Server Pre-Produção Ext
  readonly linkurlPreProd = 'https://sicomobileqa.min-saude.pt/SICO_ServicosPreProd/sicoServlet';

  constructor(public http: HttpClient) {}

  // Defining the final enviroment to access
  public setEnviroment(enviromentValue: any) {
    this.targetEnviroment = enviromentValue;
  }

  public getCurrentEnviroment() {
    return this.targetEnviroment;
  }

  public getLocalHost() {
    return this.linkurlLocalHost;
  }

  public getLocalHostWifi() {
    return this.linkUrlLocalHostWifi;
  }

  public getDev() {
    return this.linkurlDev;
  }

  public getTestes() {
    return this.linkurlTestes;
  }

  public getQAInt() {
    return this.linkurlQAInt;
  }

  public getQA() {
    return this.linkurlQA;
  }

  public getProduction() {
    return this.linkurlProd;
  }

  public getPreProdInt() {
    return this.linkurlPreProdInt;
  }

  public getPreProd() {
    return this.linkurlPreProd;
  }
}
