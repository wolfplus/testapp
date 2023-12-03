import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DefaultHeaderModule } from 'src/app/components/default-header/default-header.module';
import { MyQrCodeComponent } from './my-qr-code.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DefaultHeaderModule,
        NgxQRCodeModule,
        IonicModule,
        TranslateModule,
        ReactiveFormsModule
    ],
    declarations: [
        MyQrCodeComponent
    ],
    exports: [
        MyQrCodeComponent
    ]
})
export class MyQrCodeModule {}
