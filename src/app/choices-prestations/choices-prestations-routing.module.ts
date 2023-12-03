import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChoicesPrestationsComponent} from "./choices-prestations.component";

const routes: Routes = [
  {
    path: '',
    component: ChoicesPrestationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChoicesPrestationsRoutingModule {}
