import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AjudaPageComponent } from './ajuda';
import { AjudaRoutingModule } from './ajuda-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjudaRoutingModule
  ],
  declarations: [AjudaPageComponent]
})
export class AjudaModule {}
