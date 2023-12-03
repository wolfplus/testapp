import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { ActivityLevelsModule } from "src/app/components/activity-levels/activity-levels.module";
import { CardCoursComponent } from "./card-cours.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ActivityLevelsModule,
        TranslateModule
    ],
  declarations: [
    CardCoursComponent,
  ],
  exports: [
    CardCoursComponent
]
})
export class CardCoursModule { }