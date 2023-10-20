import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular'; //IonicApp
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx/index';

import { LoginPageComponent } from '../pages/login/login';
import { MenuPrincipalPageComponent } from '../pages/menu-principal/menu-principal';
import { RegistosPageComponent } from '../pages/registos/registos';
import { ConsultasPageComponent } from '../pages/consultas/consultas';
import { ConsultaCONormalListPageComponent } from '../pages/consulta-co-normal-list/consulta-co-normal-list';
import { ConsultaCONormalDetailsPageComponent } from '../pages/consulta-co-normal-details/consulta-co-normal-details';
import { ConsultaCOFetalListPageComponent } from '../pages/consulta-co-fetal-list/consulta-co-fetal-list';
import { ConsultaCOFetalDetailsPageComponent } from '../pages/consulta-co-fetal-details/consulta-co-fetal-details';
import { ConsultaBicListPageComponent } from '../pages/consulta-bic-list/consulta-bic-list';
import { ConsultaBicDetailsPageComponent } from '../pages/consulta-bic-details/consulta-bic-details';
import { ComplementaresPageComponent } from '../pages/complementares/complementares';
import { RegistoCONormalPageComponent } from '../pages/registo-co-normal/registo-co-normal';
import { RegistoCoFetalPageComponent } from '../pages/registo-co-fetal/registo-co-fetal';
import { RegistoBicPageComponent } from '../pages/registo-bic/registo-bic';
import { ContactosPageComponent } from '../pages/contactos/contactos';
import { SucessoCoNormalPageComponent } from '../pages/sucesso-co-normal/sucesso-co-normal';
import { SucessoCoFetalPageComponent } from '../pages/sucesso-co-fetal/sucesso-co-fetal';
import { SucessoBicPageComponent } from '../pages/sucesso-bic/sucesso-bic';
import { SobrePageComponent } from '../pages/sobre/sobre';
import { AjudaPageComponent } from '../pages/ajuda/ajuda';
import { EscolhaPdfNormalPageComponent } from '../pages/escolha-pdf-normal/escolha-pdf-normal';
import { EscolhaPdfFetalPageComponent } from '../pages/escolha-pdf-fetal/escolha-pdf-fetal';
import { EscolhaPdfBicPageComponent } from '../pages/escolha-pdf-bic/escolha-pdf-bic';
import { ComplementarCoNormalPageComponent } from '../pages/complementar-co-normal/complementar-co-normal';
import { ComplementarCoFetalPageComponent } from '../pages/complementar-co-fetal/complementar-co-fetal';
import { ComplementarBicPageComponent } from '../pages/complementar-bic/complementar-bic';
import { ConsultaComplementarCoNormalPageComponent } from '../pages/consulta-complementar-co-normal/consulta-complementar-co-normal';
import { ConsultaComplementarCoFetalPageComponent } from '../pages/consulta-complementar-co-fetal/consulta-complementar-co-fetal';
import { ConsultaComplementarBicPageComponent } from '../pages/consulta-complementar-bic/consulta-complementar-bic';


// Providers
import { ListModalComponent } from '../components/list-modal/list-modal';
import { MSICOHttpRequestInterceptor } from '../providers/msico-http-request-interceptor/msico-http-request-interceptor';
import { from } from 'ionic-native/node_modules/rxjs/observable/from';
import { MsicoEnviromentAccessProvider } from '../providers/msico-enviroment-access/msico-enviroment-access';
import { MsicoUserManagerProvider } from '../providers/msico-user-manager/msico-user-manager';
import { MsicoAlertsProvider } from '../providers/msico-alerts/msico-alerts';
import { MsicoLoadingProvider } from '../providers/msico-loading/msico-loading';
import { MsicoAuthtokenProvider } from '../providers/msico-authtoken/msico-authtoken';
import { MsicoGeneratePdfProvider } from '../providers/msico-generate-pdf/msico-generate-pdf';
import { MsicoWebServicesConormalProvider } from '../providers/msico-web-services-conormal/msico-web-services-conormal';
import { MsicoWebServicesCofetalProvider } from '../providers/msico-web-services-cofetal/msico-web-services-cofetal';
import { MsicoWebServicesBicProvider } from '../providers/msico-web-services-bic/msico-web-services-bic';
import { MsicoAuthenticationProvider } from '../providers/msico-authentication/msico-authentication';
import { MsicoHeadersProvider } from '../providers/msico-headers/msico-headers';
import { ConfigProvider } from '../providers/config/config';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { RouteReuseStrategy } from '@angular/router';

@NgModule({
  //schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  declarations: [
    AppComponent
   //SICOMobileAppComponent,
     /*LoginPageComponent,
    MenuPrincipalPageComponent,
    RegistosPageComponent,
    ConsultasPageComponent,
    ComplementaresPageComponent,
    ConsultaCONormalListPageComponent,
    ConsultaCONormalDetailsPageComponent,
    RegistoCONormalPageComponent,
    RegistoCoFetalPageComponent,
    RegistoBicPageComponent,
    ConsultaBicListPageComponent,
    ConsultaCOFetalListPageComponent,
    ConsultaCOFetalDetailsPageComponent,
    ConsultaBicDetailsPageComponent,
   
    SucessoCoFetalPageComponent,
    SucessoBicPageComponent,
    ContactosPageComponent,
    SobrePageComponent,
    AjudaPageComponent,
    ListModalComponent,
    EscolhaPdfNormalPageComponent,
    EscolhaPdfFetalPageComponent,
    EscolhaPdfBicPageComponent,
    ComplementarCoNormalPageComponent,
    ComplementarCoFetalPageComponent,
    ComplementarBicPageComponent,
    ConsultaComplementarCoNormalPageComponent,
    ConsultaComplementarCoFetalPageComponent,
    ConsultaComplementarBicPageComponent*/
    //SucessoCoNormalPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicModule.forRoot({}),
    CommonModule,
    FormsModule,
    //SICOMobileAppComponent,
    AppRoutingModule,
    /*IonicModule.forRoot(SICOMobileAppComponent, {
      iconMode: 'ios',
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    })*/
    
  ],
  //bootstrap: [SICOMobileAppComponent],
  bootstrap: [AppComponent],
  /*entryComponents: [
    SICOMobileAppComponent,
    LoginPageComponent,
    MenuPrincipalPageComponent,
    ConsultaBicListPageComponent,
    RegistosPageComponent,
    ConsultasPageComponent,
    ComplementaresPageComponent,
    ComplementarCoNormalPageComponent,
    ComplementarCoFetalPageComponent,
    ComplementarBicPageComponent,
    ConsultaComplementarCoNormalPageComponent,
    ConsultaComplementarCoFetalPageComponent,
    ConsultaComplementarBicPageComponent,
    ConsultaCONormalListPageComponent,
    ConsultaCONormalDetailsPageComponent,
    RegistoCONormalPageComponent,
    RegistoCoFetalPageComponent,
    RegistoBicPageComponent,
    ConsultaCOFetalListPageComponent,
    ConsultaCOFetalDetailsPageComponent,
    ConsultaBicDetailsPageComponent,
    SucessoCoNormalPageComponent,
    SucessoCoFetalPageComponent,
    SucessoBicPageComponent,
    SobrePageComponent,
    AjudaPageComponent,
    ContactosPageComponent,
    ListModalComponent,
    EscolhaPdfNormalPageComponent,
    EscolhaPdfFetalPageComponent,
    EscolhaPdfBicPageComponent
  ],*/
  providers: [
    InAppBrowser,
    //FileOpener,
    SplashScreen,
    //EmailComposer,
    SocialSharing,
    StatusBar,
    Keyboard,
    CallNumber,
    SafariViewController,
    Toast,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MSICOHttpRequestInterceptor,
      multi: true
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    MsicoEnviromentAccessProvider,
    MsicoUserManagerProvider,
    MsicoAlertsProvider,
    MsicoLoadingProvider,
    MsicoAuthtokenProvider,
    MsicoGeneratePdfProvider,
    MsicoWebServicesConormalProvider,
    MsicoWebServicesCofetalProvider,
    MsicoWebServicesBicProvider,  
    MsicoAuthenticationProvider,
    MsicoHeadersProvider,
    ConfigProvider
  ]
})
export class AppModule {}
