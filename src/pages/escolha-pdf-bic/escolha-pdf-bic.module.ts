import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EscolhaPdfBicPageComponent } from './escolha-pdf-bic';
import { EscolhaPdfBicRoutingModule } from './escolha-pdf-bic-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscolhaPdfBicRoutingModule
  ],
  declarations: [EscolhaPdfBicPageComponent]
})
export class EscolhaPdfBicModule {}
