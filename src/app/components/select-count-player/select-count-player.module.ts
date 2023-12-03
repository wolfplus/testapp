import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {SelectCountPlayerComponent} from './select-count-player.component';
import { PipesModule } from '../../shared/pipes/pipes.module';
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
        SelectCountPlayerComponent
    ],
    exports: [
        SelectCountPlayerComponent
    ]
})

export class SelectCountPlayerModule {}
