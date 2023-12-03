import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {ActivityLevelsComponent} from './activity-levels.component';
import { SvgContainerModule } from '../svg-container/svg-container.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule,
        SvgContainerModule
    ],
    declarations: [
        ActivityLevelsComponent
    ],
    exports: [
        ActivityLevelsComponent
    ]
})

export class ActivityLevelsModule {}
