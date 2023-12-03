import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MyPreferencesComponent} from './my-preferences.component';
import {MyPreferencesRoutingModule} from './my-preferences-routing.module';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyPreferencesRoutingModule,
        DefaultHeaderModule,
        TranslateModule.forChild(),
    ],
    exports: [
        MyPreferencesComponent
    ],
    declarations: [
        MyPreferencesComponent
    ]
})
export class MyPreferencesModule {}
