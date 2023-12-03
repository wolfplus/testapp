import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MyFriendsComponent } from './my-friends.component';
import { MyFriendsRoutingModule } from './my-friends-routing.module';
import { DefaultHeaderModule } from '../../components/default-header/default-header.module';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarNameModule } from 'src/app/components/avatar-name/avatar-name.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MyFriendsRoutingModule,
        DefaultHeaderModule,
        TranslateModule.forChild(),
        AvatarNameModule
    ],
    exports: [
        MyFriendsComponent
    ],
    declarations: [
        MyFriendsComponent
    ]
})
export class MyFriendsModule {}
