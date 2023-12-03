import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {CardActivityIconComponent} from './card-activity-icon.component';
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
        CardActivityIconComponent
    ],
    exports: [
        CardActivityIconComponent
    ]
})

export class CardActivityIconModule {}
