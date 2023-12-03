import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyCoursesComponent} from './my-courses.component';


const routes: Routes = [
    {
        path: '',
        component: MyCoursesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyCoursesRoutingModule {}
