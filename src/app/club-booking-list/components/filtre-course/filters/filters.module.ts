import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FiltersCoursePage } from './filters.page';
import { CardActivityIconModule } from 'src/app/components/card-activity-icon/card-activity-icon.module';

@NgModule({

    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        CardActivityIconModule
    ],
    exports: [
        FiltersCoursePage
    ],
    declarations: [FiltersCoursePage]
})
export class FiltersCoursePageModule {}
