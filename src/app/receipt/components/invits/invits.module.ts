import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {InvitsComponent} from './invits.component';
import { AvatarNameModule } from 'src/app/components/avatar-name/avatar-name.module';
import { ObserveVisibilityDirectiveModule } from 'src/app/shared/directives/observe-visibility/observe-visibility.directive.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        AvatarNameModule,
        ObserveVisibilityDirectiveModule
    ],
    declarations: [
        InvitsComponent
    ],
    exports: [
        InvitsComponent
    ]
})
export class InvitsModule {}
