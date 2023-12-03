import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClubBookingListPage } from './club-booking-list.page';

const routes: Routes = [
  {
    path: '',
    component: ClubBookingListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClubBookingListPageRoutingModule {}
