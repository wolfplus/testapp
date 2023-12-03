import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OptionsGroupSelectionComponent} from "./options-group-selection.component";

const routes: Routes = [
  {
    path: '',
    component: OptionsGroupSelectionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OptionsGroupSelectionRoutingModule {}
