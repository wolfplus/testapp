import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyCreditsComponent} from './my-credits.component';


const routes: Routes = [
    {
        path: '',
        component: MyCreditsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyCreditsRoutingModule {}
