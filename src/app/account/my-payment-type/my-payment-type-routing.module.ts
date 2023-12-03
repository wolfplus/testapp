import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyPaymentTypeComponent} from './my-payment-type.component';


const routes: Routes = [
    {
        path: '',
        component: MyPaymentTypeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyPaymentTypeRoutingModule {}
