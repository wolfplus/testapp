import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {StepsNumberRoundComponent} from './steps-number-round.component';
import {NumberRoundBackgroundComponent} from '../number-round-background/number-round-background.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule
    ],
    declarations: [
        StepsNumberRoundComponent,
        NumberRoundBackgroundComponent
    ],
    exports: [
        StepsNumberRoundComponent
    ]
})
export class StepsNumberRoundModule {}
