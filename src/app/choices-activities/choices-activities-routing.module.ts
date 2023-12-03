import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChoicesActivitiesComponent} from "./choices-activities.component";

const routes: Routes = [
  {
    path: '',
    component: ChoicesActivitiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChoicesActivitiesRoutingModule {}
