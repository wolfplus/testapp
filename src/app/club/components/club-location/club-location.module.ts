import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {ClubLocationComponent} from './club-location.component';
import { GoogleMapsModule } from 'src/app/components/google-maps/google-maps.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GoogleMapsModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    declarations: [
        ClubLocationComponent
    ],
    exports: [
        ClubLocationComponent
    ]
})

export class ClubLocationModule {}
