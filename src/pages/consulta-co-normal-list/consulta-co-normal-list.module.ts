import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ConsultaCONormalListPageComponent } from './consulta-co-normal-list';
import { ConsultaCONormalListRoutingModule } from './consulta-co-normal-list-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaCONormalListRoutingModule
  ],
  declarations: [ConsultaCONormalListPageComponent]
})
export class ConsultaCONormalListModule {}
