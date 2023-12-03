import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CardClubComponent } from './card-club.component';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityLevelsModule } from '../activity-levels/activity-levels.module';
import { SvgContainerModule } from '../svg-container/svg-container.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule,
        ActivityLevelsModule,
        SvgContainerModule
    ],
    declarations: [
        CardClubComponent
    ],
    exports: [
        CardClubComponent
    ]
})

export class CardClubModule {}
