import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ContactosPageComponent } from './contactos';
import { ContactosRoutingModule } from './contactos-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactosRoutingModule
  ],
  declarations: [ContactosPageComponent]
})
export class ContactosModule {}
