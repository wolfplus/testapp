import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyConsumptionComponent} from './my-consumption.component';


const routes: Routes = [
    {
        path: '',
        component: MyConsumptionComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyConsumptionRoutingModule {}
