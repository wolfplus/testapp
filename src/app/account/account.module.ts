import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccountPageRoutingModule } from './account-routing.module';
import { AccountPage } from './account.page';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderAccountModule } from './components/header-account/header-account.module';
import { TabsAccountModule } from './components/tabs-account/tabs-account.module';
import { ProfilAccountModule } from './components/profil-account/profil-account.module';
import { InformationAccountModule } from './components/informations-account/information-account.module';
import { ScrollHideHeaderModule } from '../shared/directives/scroll-hide-header.directive.module';
import { SearchUserModule } from './search-user/search-user.module';
import { SharedComponentsModule } from '../components/_shared-components/shared-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AccountPageRoutingModule,
        HeaderAccountModule,
        TabsAccountModule,
        ProfilAccountModule,
        InformationAccountModule,
        TranslateModule,
        ScrollHideHeaderModule,
        SearchUserModule,
        SharedComponentsModule
    ],
    exports: [
        AccountPage
    ],
    declarations: [
        AccountPage
    ]
})
export class AccountPageModule {}
