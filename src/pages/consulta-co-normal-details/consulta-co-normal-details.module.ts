import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ConsultaCONormalDetailsPageComponent } from './consulta-co-normal-details';
import { ConsultaCONormalDetailsRoutingModule } from './consulta-co-normal-details-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaCONormalDetailsRoutingModule
  ],
  declarations: [ConsultaCONormalDetailsPageComponent]
})
export class ConsultaCONormalDetailsModule {}
