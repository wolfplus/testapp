import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyEventsComponent} from './my-events.component';


const routes: Routes = [
    {
        path: '',
        component: MyEventsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyEventsRoutingModule {}
