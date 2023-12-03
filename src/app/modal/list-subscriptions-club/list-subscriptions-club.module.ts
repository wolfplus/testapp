import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedComponentsModule } from 'src/app/components/_shared-components/shared-components.module';
import {PipesModule} from "../../shared/pipes/pipes.module";
import {TranslateModule} from "@ngx-translate/core";
import {DefaultHeaderModule} from "../../components/default-header/default-header.module";
import {ManageMethodModule} from "../../components/payments/manage-method/manage-method.module";
import {ListSubscriptionsClubComponent} from "./list-subscriptions-club.component";

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
        ManageMethodModule
    ],
    declarations: [
        ListSubscriptionsClubComponent,
    ],
    exports: [
        ListSubscriptionsClubComponent
    ]
})

export class ListSubscriptionsClubModule {}
