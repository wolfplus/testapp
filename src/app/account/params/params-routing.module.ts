import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ParamsComponent} from './params.component';


const routes: Routes = [
    {
        path: '',
        component: ParamsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ParamsRoutingModule {}
