import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ComplementarCoNormalPageComponent } from './complementar-co-normal';
import { ComplementarCoNormalRoutingModule } from './complementar-co-normal-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComplementarCoNormalRoutingModule
  ],
  declarations: [ComplementarCoNormalPageComponent]
})
export class ComplementarCoNormalModule {}
