import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RegistosPageComponent } from './registos';
import { RegistosRoutingModule } from './registos-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistosRoutingModule
  ],
  declarations: [RegistosPageComponent]
})
export class RegistosModule {}
