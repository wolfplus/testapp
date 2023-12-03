import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DefaultHeaderModule } from '../../components/default-header/default-header.module';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarNameModule } from 'src/app/components/avatar-name/avatar-name.module';
import { SearchUserComponent } from './search-user.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DefaultHeaderModule,
        TranslateModule.forChild(),
        AvatarNameModule
    ],
    exports: [
        SearchUserComponent
    ],
    declarations: [
        SearchUserComponent
    ]
})
export class SearchUserModule {}
