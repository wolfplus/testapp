import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InformationsComponent} from './informations.component';


const routes: Routes = [
    {
        path: '',
        component: InformationsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InformationsRoutingModule {}
