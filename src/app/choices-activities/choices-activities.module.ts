import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../shared/pipes/pipes.module';
import {DefaultHeaderModule} from "../components/default-header/default-header.module";
import {ChoicesActivitiesRoutingModule} from "./choices-activities-routing.module";
import {ChoicesActivitiesComponent} from "./choices-activities.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChoicesActivitiesRoutingModule,
    TranslateModule,
    PipesModule,
    DefaultHeaderModule
  ],
  declarations: [
      ChoicesActivitiesComponent
  ]
})
export class ChoicesActivitiesModule { }
