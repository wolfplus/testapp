import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FiltersPageRoutingModule } from './filters-routing.module';
import { FiltersPage } from './filters.page';
import { SportCardModule } from '../../components/sport-card/sport-card.module';
import { CardActivityIconModule } from '../../components/card-activity-icon/card-activity-icon.module';
import { CardSurfaceModule } from '../../components/card-surface/card-surface.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({

    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FiltersPageRoutingModule,
        SportCardModule,
        CardActivityIconModule,
        CardSurfaceModule,
        TranslateModule
    ],
    exports: [
        FiltersPage
    ],
    declarations: [FiltersPage]
})
export class FiltersPageModule {}
