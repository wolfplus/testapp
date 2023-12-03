import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorApiComponent } from './error-api.component';

const routes: Routes = [{ path: '', component: ErrorApiComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorApiRoutingModule { }
