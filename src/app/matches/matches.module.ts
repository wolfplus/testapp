import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromMatches from './store/match.reducer';
import { MatchEditComponent } from './match-edit/match-edit.component';
import { MatchAddComponent } from './match-add/match-add.component';
import { EffectsModule } from '@ngrx/effects';
import { MatchEffects } from './store/match.effects';
import { MatchesRoutingModule } from './matches-routing.module';
import { GeolocationService } from '../shared/services/geolocation/geolocation.service';
import { MatchCardModule } from '../components/match-card/match-card.module';
import { SvgContainerModule } from '../components/svg-container/svg-container.module';
import { ModalContentModule } from '../components/modal-content/modal-content.module';
import { ModalBaseModule } from '../components/modal-base/modal-base.module';
import { IonicModule } from '@ionic/angular';
import { EventDetailHeaderModule } from '../club/components/event-detail-header/event-detail-header.module';
import { MatchDetailModule } from './match-detail/match-detail.module';
import { ClubCardModule } from '../components/club-card/club-card.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatchShellModule } from './match-shell/match-shell.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    StoreModule.forFeature(fromMatches.matchesFeatureKey, fromMatches.matchReducer),
    EffectsModule.forFeature([MatchEffects]),
    MatchesRoutingModule,
    MatchCardModule,
    SvgContainerModule,
    ModalContentModule,
    ModalBaseModule,
    EventDetailHeaderModule,
    /* TODO: import nécessaire ? */
    MatchShellModule,
    MatchDetailModule,
    TranslateModule,
    ClubCardModule,
  ],
  declarations: [
    MatchEditComponent,
    MatchAddComponent
  ],
  exports: [
    MatchEditComponent,
    MatchAddComponent
  ],
  providers: [
    GeolocationService
  ]
})
export class MatchesModule {}
