import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ConsultasPageComponent } from './consultas';
import { ConsultasRoutingModule } from './consultas-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultasRoutingModule
  ],
  declarations: [ConsultasPageComponent]
})
export class ConsultasModule {}
