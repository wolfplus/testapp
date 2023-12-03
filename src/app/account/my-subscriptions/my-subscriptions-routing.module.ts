import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MySubscriptionsComponent} from './my-subscriptions.component';


const routes: Routes = [
    {
        path: '',
        component: MySubscriptionsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MySubscriptionsRoutingModule {}
