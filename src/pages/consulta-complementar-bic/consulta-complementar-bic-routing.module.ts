import { ConsultaComplementarBicPageComponent } from './consulta-complementar-bic';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ConsultaComplementarBicPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaComplementarBicRoutingModule {}
