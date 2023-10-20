import { ConsultaComplementarCoFetalPageComponent } from './../pages/consulta-complementar-co-fetal/consulta-complementar-co-fetal';
import { ConsultaComplementarBicPageComponent } from './../pages/consulta-complementar-bic/consulta-complementar-bic';
import { ConsultaComplementarCoNormalPageComponent } from './../pages/consulta-complementar-co-normal/consulta-complementar-co-normal';
import { ConsultaCONormalDetailsPageComponent } from './../pages/consulta-co-normal-details/consulta-co-normal-details';
import { SucessoCoFetalPageComponent } from './../pages/sucesso-co-fetal/sucesso-co-fetal';
import { ConsultaBicDetailsPageComponent } from './../pages/consulta-bic-details/consulta-bic-details';
import { SucessoCoNormalPageComponent } from './../pages/sucesso-co-normal/sucesso-co-normal';
import { SucessoBicPageComponent } from './../pages/sucesso-bic/sucesso-bic';
import { ConsultaCOFetalDetailsPageComponent } from './../pages/consulta-co-fetal-details/consulta-co-fetal-details';
import { EscolhaPdfNormalPageComponent } from './../pages/escolha-pdf-normal/escolha-pdf-normal';
import { EscolhaPdfBicPageComponent } from './../pages/escolha-pdf-bic/escolha-pdf-bic';
import { EscolhaPdfFetalPageComponent } from './../pages/escolha-pdf-fetal/escolha-pdf-fetal';
import { ConsultaBicListPageComponent } from './../pages/consulta-bic-list/consulta-bic-list';
import { ConsultaCOFetalListPageComponent } from './../pages/consulta-co-fetal-list/consulta-co-fetal-list';
import { ConsultaCONormalListPageComponent } from './../pages/consulta-co-normal-list/consulta-co-normal-list';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MenuPrincipalPageComponent } from './../pages/menu-principal/menu-principal';
import { LoginPageComponent } from './../pages/login/login';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  
  { path: 'consultaCONormal', component: ConsultaCONormalListPageComponent },
  { path: 'consultaCOFetal', component: ConsultaCOFetalListPageComponent },
  { path: 'consultaBic', component: ConsultaBicListPageComponent },

  //{ path: 'escolhaPDFFetal', component: EscolhaPdfFetalPageComponent },
  //{ path: 'escolhaPDFBic', component: EscolhaPdfBicPageComponent },
  //{ path: 'escolhaPDFNormal', component: EscolhaPdfNormalPageComponent },

  { path: 'consultaCOFetalDetails', component: ConsultaCOFetalDetailsPageComponent },

  //{ path: 'sucessoBic', component: SucessoBicPageComponent },
  {
    path: 'sucessoBic',
    loadChildren: () => import('../pages/sucesso-bic/sucesso-bic.module').then( m => m.SucessoBicModule)
  },

  //{ path: 'sucessoCONormal', component: SucessoCoNormalPageComponent },
  {
    path: 'sucessoCONormal',
    loadChildren: () => import('../pages/sucesso-co-normal/sucesso-co-normal.module').then( m => m.SucessoCoNormalModule)
  },

  { path: 'consultaBicDetails', component: ConsultaBicDetailsPageComponent },

  //{ path: 'sucessoCOFetal', component: SucessoCoFetalPageComponent },
  {
    path: 'sucessoCOFetal',
    loadChildren: () => import('../pages/sucesso-co-fetal/sucesso-co-fetal.module').then( m => m.SucessoCoFetalModule)
  },

  {
    path: 'sobre',
    loadChildren: () => import('../pages/sobre/sobre.module').then( m => m.SobreModule)
  },

  {
    path: 'registos',
    loadChildren: () => import('../pages/registos/registos.module').then( m => m.RegistosModule)
  },

  {
    path: 'registoCoNormal',
    loadChildren: () => import('../pages/registo-co-normal/registo-co-normal.module').then( m => m.RegistoCONormalModule)
  },

  {
    path: 'registoCoFetal',
    loadChildren: () => import('../pages/registo-co-fetal/registo-co-fetal.module').then( m => m.RegistoCoFetalModule)
  },

  {
    path: 'registoBic',
    loadChildren: () => import('../pages/registo-bic/registo-bic.module').then( m => m.RegistoBicModule)
  },

  //{ path: 'menu', component: MenuPrincipalPageComponent },
  {
    path: 'menu',
    loadChildren: () => import('../pages/menu-principal/menu-principal.module').then( m => m.MenuPrincipalModule)
  },

  //{ path: 'login', component: LoginPageComponent },
  {
    path: 'login',
    loadChildren: () => import('../pages/login/login.module').then( m => m.LoginModule)
  },

  {
    path: 'escolhaPDFNormal',
    loadChildren: () => import('../pages/escolha-pdf-normal/escolha-pdf-normal.module').then( m => m.EscolhaPdfNormalModule)
  },

  {
    path: 'escolhaPDFFetal',
    loadChildren: () => import('../pages/escolha-pdf-fetal/escolha-pdf-fetal.module').then( m => m.EscolhaPdfFetalModule)
  },

  {
    path: 'escolhaPDFBic',
    loadChildren: () => import('../pages/escolha-pdf-bic/escolha-pdf-bic.module').then( m => m.EscolhaPdfBicModule)
  },

  {
    path: 'contactos',
    loadChildren: () => import('../pages/contactos/contactos.module').then( m => m.ContactosModule)
  },

  {
    path: 'consultas',
    loadChildren: () => import('../pages/consultas/consultas.module').then( m => m.ConsultasModule)
  },

  {
    path: 'consultasComplementarCONormal',
    loadChildren: () => import('../pages/consulta-complementar-co-normal/consulta-complementar-co-normal.module').then( m => m.ConsultaComplementarCoNormalModule)
  },

  {
    path: 'consultasComplementarCOFetal',
    loadChildren: () => import('../pages/consulta-complementar-co-fetal/consulta-complementar-co-fetal.module').then( m => m.ConsultaComplementarCoFetalModule)
  },

  {
    path: 'consultasComplementarBic',
    loadChildren: () => import('../pages/consulta-complementar-bic/consulta-complementar-bic.module').then( m => m.ConsultaComplementarBicModule)
  },

  {
    path: 'consultaCONormalList',
    loadChildren: () => import('../pages/consulta-co-normal-list/consulta-co-normal-list.module').then( m => m.ConsultaCONormalListModule)
  },

  {
    path: 'consultaCONormalDetails',
    loadChildren: () => import('../pages/consulta-co-normal-details/consulta-co-normal-details.module').then( m => m.ConsultaCONormalDetailsModule)
  },

  {
    path: 'consultaCOFetalList',
    loadChildren: () => import('../pages/consulta-co-fetal-list/consulta-co-fetal-list.module').then( m => m.ConsultaCOFetalListModule)
  },

  {
    path: 'consultaCOFetalDetails',
    loadChildren: () => import('../pages/consulta-co-fetal-details/consulta-co-fetal-details.module').then( m => m.ConsultaCOFetalDetailsModule)
  },

  {
    path: 'consultaBicList',
    loadChildren: () => import('../pages/consulta-bic-list/consulta-bic-list.module').then( m => m.ConsultaBicListModule)
  },

  {
    path: 'consultaBicDetails',
    loadChildren: () => import('../pages/consulta-bic-details/consulta-bic-details.module').then( m => m.ConsultaBicDetailsModule)
  },

  {
    path: 'complementares',
    loadChildren: () => import('../pages/complementares/complementares.module').then( m => m.ComplementaresModule)
  },

  {
    path: 'complementarCoNormal',
    loadChildren: () => import('../pages/complementar-co-normal/complementar-co-normal.module').then( m => m.ComplementarCoNormalModule)
  },

  {
    path: 'complementarCoFetal',
    loadChildren: () => import('../pages/complementar-co-fetal/complementar-co-fetal.module').then( m => m.ComplementarCoFetalModule)
  },

  {
    path: 'complementarBic',
    loadChildren: () => import('../pages/complementar-bic/complementar-bic.module').then( m => m.ComplementarBicModule)
  },
  
  {
    path: 'ajuda',
    loadChildren: () => import('../pages/ajuda/ajuda.module').then( m => m.AjudaModule)
  },

  {
    path: 'listModal',
    loadChildren: () => import('../components/list-modal/list-modal.module').then( m => m.ListModalModule)
  },

  /*{ path: 'consultaCONormalDetails', component: ConsultaCONormalDetailsPageComponent },
  { path: 'consultaComplementarCONormal', component: ConsultaComplementarCoNormalPageComponent },
  { path: 'consultaComplementarCOFetal', component: ConsultaComplementarCoFetalPageComponent },
  { path: 'consultaComplementarBic', component: ConsultaComplementarBicPageComponent },*/
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
