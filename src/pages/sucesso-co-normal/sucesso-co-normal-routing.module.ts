import { SucessoCoNormalPageComponent } from './sucesso-co-normal';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SucessoCoNormalPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SucessoCoNormalRoutingModule {}
