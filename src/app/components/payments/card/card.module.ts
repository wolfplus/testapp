import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {CardComponent} from './card.component';
import {HideNumberCard} from '../../../shared/pipes/hideNumberCard';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    declarations: [
        CardComponent,
        HideNumberCard
    ],
    exports: [
        CardComponent,
        HideNumberCard
    ]
})

export class CardModule {}
