import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyOperationsComponent} from './my-operations.component';


const routes: Routes = [
    {
        path: '',
        component: MyOperationsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyOperationsRoutingModule {}
