import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {AvatarNameTabletComponent} from './avatar-name-tablet.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [
    AvatarNameTabletComponent
  ],
  exports: [
    AvatarNameTabletComponent
  ]
})

export class AvatarNameTabletModule {}
