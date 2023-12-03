import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventAttendersComponent } from './event-attenders.component';
import { EventAttenderAvatarModule } from '../event-attender-avatar/event-attender-avatar.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import {IonicModule} from '@ionic/angular';

@NgModule({
    imports: [
        CommonModule,
        EventAttenderAvatarModule,
        TranslateModule,
        PipesModule,
        IonicModule
    ],
  declarations: [EventAttendersComponent],
  exports: [EventAttendersComponent]
})
export class EventAttendersModule { }
