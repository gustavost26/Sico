import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ConsultaCOFetalDetailsPageComponent } from './consulta-co-fetal-details';
import { ConsultaCOFetalDetailsRoutingModule } from './consulta-co-fetal-details-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaCOFetalDetailsRoutingModule
  ],
  declarations: [ConsultaCOFetalDetailsPageComponent]
})
export class ConsultaCOFetalDetailsModule {}
