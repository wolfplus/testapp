import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { SelectPlaygroundOptionsComponent } from './select-playground-options.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule,
        PipesModule
    ],
    declarations: [
        SelectPlaygroundOptionsComponent
    ],
    exports: [
        SelectPlaygroundOptionsComponent
    ]
})

export class SelectPlaygroundOptionsModule{}
