import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import { GoogleMapsComponent } from './google-maps.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    declarations: [
        GoogleMapsComponent
    ],
    exports: [
        GoogleMapsComponent
    ]
})

export class GoogleMapsModule {}
