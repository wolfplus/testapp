import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ClassDetailComponent } from './class-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { EventDetailHeaderModule } from 'src/app/club/components/event-detail-header/event-detail-header.module';
import {FormsModule} from "@angular/forms";
import { ParticipantsInfoColorDirective } from './participants-info-color.directive';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PipesModule,
    TranslateModule,
    EventDetailHeaderModule,
    FormsModule
  ],
  declarations: [	ClassDetailComponent,ParticipantsInfoColorDirective]
})
export class ClassDetailModule {}
