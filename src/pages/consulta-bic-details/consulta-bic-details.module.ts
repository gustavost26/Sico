import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ConsultaBicDetailsPageComponent } from './consulta-bic-details';
import { ConsultaBicDetailsRoutingModule } from './consulta-bic-details-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaBicDetailsRoutingModule
  ],
  declarations: [ConsultaBicDetailsPageComponent]
})
export class ConsultaBicDetailsModule {}
