import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SobrePageComponent } from './sobre';
import { SobreRoutingModule } from './sobre-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SobreRoutingModule
  ],
  declarations: [SobrePageComponent]
})
export class SobreModule {}
