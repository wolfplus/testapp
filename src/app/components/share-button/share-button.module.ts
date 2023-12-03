import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {ShareButtonComponent} from './share-button.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule
    ],
    declarations: [
        ShareButtonComponent
    ],
    exports: [
        ShareButtonComponent
    ]
})
export class ShareButtonModule {}
