import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ConsultaComplementarBicPageComponent } from './consulta-complementar-bic';
import { ConsultaComplementarBicRoutingModule } from './consulta-complementar-bic-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaComplementarBicRoutingModule
  ],
  declarations: [ConsultaComplementarBicPageComponent]
})
export class ConsultaComplementarBicModule {}
