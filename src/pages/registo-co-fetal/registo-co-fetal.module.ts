import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RegistoCoFetalPageComponent } from './registo-co-fetal';
import { RegistoCoFetalRoutingModule } from './registo-co-fetal-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistoCoFetalRoutingModule
  ],
  declarations: [RegistoCoFetalPageComponent]
})
export class RegistoCoFetalModule {}
