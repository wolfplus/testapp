import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReceiptPage } from './receipt.page';
import {TranslateModule} from '@ngx-translate/core';
import {TabsReceiptModule} from './components/tabs-receipt/tabs-receipt.module';
import {NotificationsModule} from './components/notifications/notifications.module';
import {InvitsModule} from './components/invits/invits.module';
import {ConversationModule} from './components/conversation/conversation.module';
import {ReceiptRoutingModule} from "./receipt-routing.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReceiptRoutingModule,
        TranslateModule,
        TabsReceiptModule,
        NotificationsModule,
        InvitsModule,
        ConversationModule
    ],
    declarations: [ReceiptPage]
})
export class ReceiptPageModule {}
