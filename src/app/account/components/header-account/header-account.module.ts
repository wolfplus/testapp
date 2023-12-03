import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {HeaderAccountComponent} from './header-account.component';
import { SvgContainerModule } from 'src/app/components/svg-container/svg-container.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule,
        SvgContainerModule
    ],
    declarations: [
        HeaderAccountComponent
    ],
    exports: [
        HeaderAccountComponent
    ]
})

export class HeaderAccountModule {}
