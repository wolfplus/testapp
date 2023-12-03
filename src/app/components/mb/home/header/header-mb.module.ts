import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {HeaderMbComponent} from './header-mb.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ContactModalModule } from '../contact-modal/contact-modal.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        ContactModalModule,
        TranslateModule,
        PipesModule
    ],
    declarations: [
        HeaderMbComponent
    ],
    exports: [
        HeaderMbComponent
    ]
})
export class HeaderMbModule {}
