import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SucessoBicPageComponent } from './sucesso-bic';
import { SucessoBicRoutingModule } from './sucesso-bic-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SucessoBicRoutingModule
  ],
  declarations: [SucessoBicPageComponent]
})
export class SucessoBicModule {}
