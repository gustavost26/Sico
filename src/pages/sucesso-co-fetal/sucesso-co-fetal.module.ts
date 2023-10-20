import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SucessoCoFetalPageComponent } from './sucesso-co-fetal';
import { SucessoCoFetalRoutingModule } from './sucesso-co-fetal-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SucessoCoFetalRoutingModule
  ],
  declarations: [SucessoCoFetalPageComponent]
})
export class SucessoCoFetalModule {}
