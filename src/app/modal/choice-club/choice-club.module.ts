import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {DefaultHeaderModule} from '../../components/default-header/default-header.module';
import {TranslateModule} from '@ngx-translate/core';
import {PipesModule} from '../../shared/pipes/pipes.module';
import { SharedComponentsModule } from 'src/app/components/_shared-components/shared-components.module';
import { ChoiceClubComponent } from './choice-club.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        DefaultHeaderModule,
        TranslateModule,
        PipesModule,
        SharedComponentsModule,
        Ng2SearchPipeModule
    ],
    declarations: [
        ChoiceClubComponent
    ],
    exports: [
        ChoiceClubComponent
    ]
})

export class ChoiceClubModule {}
