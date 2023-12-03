import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {LocationComponent} from './location.component';
import {ClubLocationModule} from '../../club/components/club-location/club-location.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule,
        ClubLocationModule
    ],
    declarations: [
        LocationComponent
    ],
    exports: [
        LocationComponent
    ]
})

export class LocationModule {}
