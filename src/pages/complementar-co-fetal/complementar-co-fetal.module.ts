import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ComplementarCoFetalPageComponent } from './complementar-co-fetal';
import { ComplementarCoFetalRoutingModule } from './complementar-co-fetal-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComplementarCoFetalRoutingModule
  ],
  declarations: [ComplementarCoFetalPageComponent]
})
export class ComplementarCoFetalModule {}
