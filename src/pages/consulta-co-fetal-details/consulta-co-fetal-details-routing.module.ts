import { ConsultaCOFetalDetailsPageComponent } from './consulta-co-fetal-details';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ConsultaCOFetalDetailsPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaCOFetalDetailsRoutingModule {}
