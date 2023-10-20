import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ConsultaComplementarCoFetalPageComponent } from './consulta-complementar-co-fetal';
import { ConsultaComplementarCoFetalRoutingModule } from './consulta-complementar-co-fetal-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaComplementarCoFetalRoutingModule
  ],
  declarations: [ConsultaComplementarCoFetalPageComponent]
})
export class ConsultaComplementarCoFetalModule {}
