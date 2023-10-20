import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ListModalComponent } from './list-modal';
import { ListModalRoutingModule } from './list-modal-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListModalRoutingModule
  ],
  declarations: [ListModalComponent]
})
export class ListModalModule {}
