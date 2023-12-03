import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyWalletsComponent } from './my-wallets.component';


const routes: Routes = [
    {
        path: '',
        component: MyWalletsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyWalletsRoutingModule {}
