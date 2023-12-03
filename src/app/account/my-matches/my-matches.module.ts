import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MyMatchesComponent} from './my-matches.component';
import {MyMatchesRoutingModule} from './my-matches-routing.module';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {MatchCardModule} from '../../components/match-card/match-card.module';
import {TranslateModule} from '@ngx-translate/core';
import { MatchCardTabletModule } from 'src/app/components/match-card-tablet/match-card-tablet.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyMatchesRoutingModule,
        DefaultHeaderModule,
        MatchCardModule,
        MatchCardTabletModule,
        TranslateModule.forChild()
    ],
    exports: [
        MyMatchesComponent
    ],
    declarations: [
        MyMatchesComponent
    ]
})
export class MyMatchesModule {}
