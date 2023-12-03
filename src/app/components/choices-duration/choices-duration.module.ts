import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {ChoicesDurationComponent} from "./choices-duration.component";
import {PipesModule} from "../../shared/pipes/pipes.module";


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
        ChoicesDurationComponent
    ],
    exports: [
        ChoicesDurationComponent
    ]
})

export class ChoicesDurationModule {}
