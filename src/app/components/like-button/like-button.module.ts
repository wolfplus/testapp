import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {LikeButtonComponent} from './like-button.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    declarations: [
        LikeButtonComponent
    ],
    exports: [
        LikeButtonComponent
    ]
})

export class LikeButtonModule {}
