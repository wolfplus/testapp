import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {CardShortEventComponent} from './card-short-event.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule
    ],
    declarations: [
        CardShortEventComponent
    ],
    exports: [
        CardShortEventComponent
    ]
})

export class CardShortEventModule {}
