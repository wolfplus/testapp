import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BookingGroupSelectionComponent} from "./booking-group-selection.component";

const routes: Routes = [
  {
    path: '',
    component: BookingGroupSelectionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingGroupSelectionRoutingModule {}
