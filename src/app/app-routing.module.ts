import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'es', component: HomeComponent },
  { path: 'en', component: HomeComponent },
  { path: '', redirectTo: '/es', pathMatch: 'full' },
  { path: '**', redirectTo: '/es' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
