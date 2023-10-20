import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ConsultaCOFetalListPageComponent } from './consulta-co-fetal-list';
import { ConsultaCOFetalListRoutingModule } from './consulta-co-fetal-list-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaCOFetalListRoutingModule
  ],
  declarations: [ConsultaCOFetalListPageComponent]
})
export class ConsultaCOFetalListModule {}
