import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyPreferencesComponent} from './my-preferences.component';


const routes: Routes = [
    {
        path: '',
        component: MyPreferencesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyPreferencesRoutingModule {}
