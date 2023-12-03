import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {ActionsComponent} from './actions.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import {SvgContainerModule} from "../../../svg-container/svg-container.module";
import { LazyImageModule } from 'src/app/shared/lazy-img/lazy-img.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule,
        PipesModule,
        LazyImageModule,
        SvgContainerModule
    ],
    declarations: [
        ActionsComponent
    ],
    exports: [
        ActionsComponent
    ]
})
export class ActionsModule {}
