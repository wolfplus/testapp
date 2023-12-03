import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {ModalHeaderComponent} from './modal-header.component';
import {EventTitleModule} from '../../club/components/event-title/event-title.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule,
        EventTitleModule
    ],
    declarations: [
        ModalHeaderComponent
    ],
    exports: [
        ModalHeaderComponent
    ]
})

export class ModalHeaderModule {}
