import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ConsultaComplementarCoNormalPageComponent } from './consulta-complementar-co-normal';
import { ConsultaComplementarCoNormalRoutingModule } from './consulta-complementar-co-normal-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaComplementarCoNormalRoutingModule
  ],
  declarations: [ConsultaComplementarCoNormalPageComponent]
})
export class ConsultaComplementarCoNormalModule {}
