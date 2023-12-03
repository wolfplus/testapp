import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {CardShortClubComponent} from './card-short-club.component';
import { SvgContainerModule } from '../svg-container/svg-container.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        SvgContainerModule,
        IonicModule
    ],
    declarations: [
        CardShortClubComponent
    ],
    exports: [
        CardShortClubComponent
    ]
})

export class CardShortClubModule {}
