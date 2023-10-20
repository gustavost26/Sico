import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EscolhaPdfNormalPageComponent } from './escolha-pdf-normal';
import { EscolhaPdfNormalRoutingModule } from './escolha-pdf-normal-routing.module';

@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscolhaPdfNormalRoutingModule
  ],
  declarations: [EscolhaPdfNormalPageComponent]
})
export class EscolhaPdfNormalModule {}
