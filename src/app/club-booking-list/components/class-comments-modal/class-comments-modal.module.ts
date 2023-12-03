import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ClassCommentsModalComponent } from './class-comments-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { EventDetailHeaderModule } from 'src/app/club/components/event-detail-header/event-detail-header.module';
import {FormsModule} from "@angular/forms";
import {DefaultHeaderModule} from "../../../components/default-header/default-header.module";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    TranslateModule,
    EventDetailHeaderModule,
    FormsModule,
    DefaultHeaderModule
  ],
  declarations: [ClassCommentsModalComponent]
})
export class ClassCommentsModalModule {}
