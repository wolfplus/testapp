import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from 'src/app/components/_shared-components/shared-components.module';
import {PipesModule} from "../../shared/pipes/pipes.module";
import {TranslateModule} from "@ngx-translate/core";
import {DefaultHeaderModule} from "../../components/default-header/default-header.module";
import {CalendarComponent} from "./calendar.component";
import { CalendarModule } from "ion2-calendar";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        DefaultHeaderModule,
        TranslateModule,
        PipesModule,
        SharedComponentsModule,
        CalendarModule
    ],
    declarations: [
        CalendarComponent
    ],
    exports: [
        CalendarComponent
    ]
})

export class CalendarReModule {}
