import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {SportCardComponent} from './sport-card.component';
import { SvgContainerModule } from '../svg-container/svg-container.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        SvgContainerModule
    ],
    declarations: [
        SportCardComponent
    ],
    exports: [
        SportCardComponent
    ]
})
export class SportCardModule {}
