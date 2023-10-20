import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EscolhaPdfFetalPageComponent } from './escolha-pdf-fetal';
import { EscolhaPdfFetalRoutingModule } from './escolha-pdf-fetal-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscolhaPdfFetalRoutingModule
  ],
  declarations: [EscolhaPdfFetalPageComponent]
})
export class EscolhaPdfFetalModule {}
