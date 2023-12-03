import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingSportPage } from './booking-sport.page';

const routes: Routes = [
  {
    path: '',
    component: BookingSportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingSportPageRoutingModule {}
