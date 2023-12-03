import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BookingGroupFormComponent} from "./booking-group-form.component";

const routes: Routes = [
  {
    path: '',
    component: BookingGroupFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingGroupFormRoutingModule {}
