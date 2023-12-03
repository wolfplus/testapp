import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyActivitiesComponent} from './my-activities.component';


const routes: Routes = [
    {
        path: '',
        component: MyActivitiesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyActivitiesRoutingModule {}
