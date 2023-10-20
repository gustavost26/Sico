import { EscolhaPdfFetalPageComponent } from './escolha-pdf-fetal';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: EscolhaPdfFetalPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EscolhaPdfFetalRoutingModule {}
