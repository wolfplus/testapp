import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialNetworksLinksComponent } from './social-networks-links.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    IonicModule
  ],
  declarations: [SocialNetworksLinksComponent],
  exports: [SocialNetworksLinksComponent]
})
export class SocialNetworksLinksModule { }
