import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RegistoCONormalPageComponent } from './registo-co-normal';
import { RegistoCONormalRoutingModule } from './registo-co-normal-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistoCONormalRoutingModule
  ],
  declarations: [RegistoCONormalPageComponent]
})
export class RegistoCONormalModule {}
