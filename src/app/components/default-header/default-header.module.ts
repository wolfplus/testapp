import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {DefaultHeaderComponent} from './default-header.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule.forChild()
    ],
    declarations: [
        DefaultHeaderComponent
    ],
    exports: [
        DefaultHeaderComponent
    ]
})

export class DefaultHeaderModule {}
