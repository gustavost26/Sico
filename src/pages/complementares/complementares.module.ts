import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ComplementaresPageComponent } from './complementares';
import { ComplementaresRoutingModule } from './complementares-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComplementaresRoutingModule
  ],
  declarations: [ComplementaresPageComponent]
})
export class ComplementaresModule {}
