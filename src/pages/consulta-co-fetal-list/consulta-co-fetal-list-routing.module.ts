import { ConsultaCOFetalListPageComponent } from './consulta-co-fetal-list';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ConsultaCOFetalListPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaCOFetalListRoutingModule {}
