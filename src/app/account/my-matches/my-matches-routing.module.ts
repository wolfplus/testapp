import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyMatchesComponent} from './my-matches.component';


const routes: Routes = [
    {
        path: '',
        component: MyMatchesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyMatchesRoutingModule {}
