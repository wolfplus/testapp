import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MyClubsComponent} from './my-clubs.component';
import {MyClubsRoutingModule} from './my-clubs-routing.module';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {CardClubModule} from '../../components/card-club/card-club.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyClubsRoutingModule,
        DefaultHeaderModule,
        TranslateModule.forChild(),
        CardClubModule
    ],
    exports: [
        MyClubsComponent
    ],
    declarations: [
        MyClubsComponent
    ]
})
export class MyClubsModule {}
