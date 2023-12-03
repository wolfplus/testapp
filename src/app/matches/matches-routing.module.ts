import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatchShellComponent } from './match-shell/match-shell.component';


const routes: Routes = [
  {
    path: '',
    component: MatchShellComponent
    // loadChildren: () => import('./matches.module').then( m => m.MatchesModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchesRoutingModule {}
