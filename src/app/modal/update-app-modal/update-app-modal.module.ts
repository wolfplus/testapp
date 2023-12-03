import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {TranslateModule} from "@ngx-translate/core";
import {UpdateAppModalComponent} from './update-app-modal.component';

@NgModule({
    declarations: [UpdateAppModalComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
    ],
    exports: []
})
export class UpdateAppModalModule {}

