import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerComponent } from './player.component';
import { DefaultHeaderModule } from '../components/default-header/default-header.module';
import { CardShortClubModule } from '../components/card-short-club/card-short-club.module';
import { HeaderAccountModule } from '../account/components/header-account/header-account.module';
import { TabsAccountModule } from '../account/components/tabs-account/tabs-account.module';
import { ProfilAccountModule } from '../account/components/profil-account/profil-account.module';
import { LevelCardModule } from '../account/components/level-card/level-card.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        DefaultHeaderModule,
        CardShortClubModule,
        HeaderAccountModule,
        TabsAccountModule,
        ProfilAccountModule,
        LevelCardModule
    ],
    declarations: [
        PlayerComponent
    ],
    exports: [
        PlayerComponent
    ]
})

export class PlayerModule {}
