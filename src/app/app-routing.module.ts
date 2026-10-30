import { inject, NgModule } from '@angular/core';
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router';
import { detectLang, isLang } from './i18n.service';

const redirectToDetectedLang: CanActivateFn = () =>
  inject(Router).createUrlTree(['/', detectLang()]);

const validLangGuard: CanActivateFn = (route) =>
  isLang(route.paramMap.get('lang'))
    ? true
    : inject(Router).createUrlTree(['/', detectLang()]);

const routes: Routes = [
  { path: '', pathMatch: 'full', canActivate: [redirectToDetectedLang], children: [] },
  { path: ':lang', canActivate: [validLangGuard], children: [] },
  { path: '**', canActivate: [redirectToDetectedLang], children: [] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
