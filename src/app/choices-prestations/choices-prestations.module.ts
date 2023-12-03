import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../shared/pipes/pipes.module';
import {ChoicesPrestationsComponent} from "./choices-prestations.component";
import {DefaultHeaderModule} from "../components/default-header/default-header.module";
import {ChoicesPrestationsRoutingModule} from "./choices-prestations-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChoicesPrestationsRoutingModule,
    TranslateModule,
    PipesModule,
    DefaultHeaderModule
  ],
  declarations: [
      ChoicesPrestationsComponent
  ]
})
export class ChoicesPrestationsModule { }
