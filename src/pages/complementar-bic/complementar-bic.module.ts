import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ComplementarBicPageComponent } from './complementar-bic';
import { ComplementarBicRoutingModule } from './complementar-bic-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComplementarBicRoutingModule
  ],
  declarations: [ComplementarBicPageComponent]
})
export class ComplementarBicModule {}
