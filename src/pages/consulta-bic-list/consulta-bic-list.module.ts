import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ConsultaBicListPageComponent } from './consulta-bic-list';
import { ConsultaBicListRoutingModule } from './consulta-bic-list-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsultaBicListRoutingModule
  ],
  declarations: [ConsultaBicListPageComponent]
})
export class ConsultaBicListModule {}
