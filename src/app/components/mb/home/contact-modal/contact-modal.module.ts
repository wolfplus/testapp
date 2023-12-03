import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { DefaultHeaderModule } from "src/app/components/default-header/default-header.module";
import { ContactModalComponent } from "./contact-modal.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        DefaultHeaderModule
    ],
  declarations: [
    ContactModalComponent,
  ],
  exports: [
    ContactModalComponent
]
})
export class ContactModalModule { }