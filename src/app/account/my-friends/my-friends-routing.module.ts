import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MyFriendsComponent} from './my-friends.component';


const routes: Routes = [
    {
        path: '',
        component: MyFriendsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyFriendsRoutingModule {}
