import { EscolhaPdfBicPageComponent } from './escolha-pdf-bic';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: EscolhaPdfBicPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EscolhaPdfBicRoutingModule {}
