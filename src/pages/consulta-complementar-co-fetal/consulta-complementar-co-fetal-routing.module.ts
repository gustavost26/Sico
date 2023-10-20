import { ConsultaComplementarCoFetalPageComponent } from './consulta-complementar-co-fetal';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ConsultaComplementarCoFetalPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaComplementarCoFetalRoutingModule {}
