import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {FilterButtonComponent} from './filter-button.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { SvgContainerModule } from '../svg-container/svg-container.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        InlineSVGModule.forRoot({}),
        SvgContainerModule
    ],
    declarations: [
        FilterButtonComponent
    ],
    exports: [
        FilterButtonComponent
    ]
})

export class FilterButtonModule {}
