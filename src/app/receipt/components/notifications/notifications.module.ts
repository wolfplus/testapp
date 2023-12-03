import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationsComponent } from './notifications.component';
import { ObserveVisibilityDirectiveModule } from 'src/app/shared/directives/observe-visibility/observe-visibility.directive.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        ObserveVisibilityDirectiveModule
    ],
    declarations: [
        NotificationsComponent
    ],
    exports: [
        NotificationsComponent
    ]
})
export class NotificationsModule {}
