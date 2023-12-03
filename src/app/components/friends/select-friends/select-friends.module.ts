import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {SelectFriendsComponent} from './select-friends.component';
import {FriendCardModule} from '../friend-card/friend-card.module';
import { AvatarNameModule } from '../../avatar-name/avatar-name.module';
import {DefaultHeaderModule} from "../../default-header/default-header.module";
import { ManageMethodModule } from '../../payments/manage-method/manage-method.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        TranslateModule,
        FriendCardModule,
        AvatarNameModule,
        DefaultHeaderModule,
        ManageMethodModule
    ],
    declarations: [
        SelectFriendsComponent
    ],
    exports: [
        SelectFriendsComponent
    ]
})

export class SelectFriendsModule {}
