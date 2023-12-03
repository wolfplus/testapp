import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {UserActionsComponent} from './user-actions.component';
import {LocaleChoiceModule} from '../locale-choice/locale-choice.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        LocaleChoiceModule
    ],
    declarations: [
        UserActionsComponent
    ],
    exports: [
        UserActionsComponent
    ]
})
export class UserActionsModule {}
