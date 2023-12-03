import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyClubsComponent} from './my-clubs.component';


const routes: Routes = [
    {
        path: '',
        component: MyClubsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyClubsRoutingModule {}
