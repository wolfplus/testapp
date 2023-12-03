import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { SelectLocaleComponent } from "./select-locale.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
    ],
  declarations: [
    SelectLocaleComponent,
  ],
  exports: [
    SelectLocaleComponent
]
})
export class SelectLocaleModule { }