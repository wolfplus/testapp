import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {EventAttenderAvatarComponent} from './event-attender-avatar.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    declarations: [
        EventAttenderAvatarComponent
    ],
    exports: [
        EventAttenderAvatarComponent
    ]
})

export class EventAttenderAvatarModule {}
