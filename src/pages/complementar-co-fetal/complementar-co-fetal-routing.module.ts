import { ComplementarCoFetalPageComponent } from './complementar-co-fetal';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ComplementarCoFetalPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplementarCoFetalRoutingModule {}
