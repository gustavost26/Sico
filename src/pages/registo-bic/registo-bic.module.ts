import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RegistoBicPageComponent } from './registo-bic';
import { RegistoBicRoutingModule } from './registo-bic-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistoBicRoutingModule
  ],
  declarations: [RegistoBicPageComponent]
})
export class RegistoBicModule {}
