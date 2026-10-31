import { inject, NgModule } from '@angular/core';
import { CanActivateFn, Router, RouterModule, Routes } from '@angular/router';
import { detectLang, isLang } from './i18n.service';
import { HomeComponent } from './home/home.component';
import { CustomWebsitesComponent } from './custom-websites/custom-websites.component';

const redirectToDetectedLang: CanActivateFn = () =>
  inject(Router).createUrlTree(['/', detectLang()]);

const validLangGuard: CanActivateFn = (route) =>
  isLang(route.paramMap.get('lang'))
    ? true
    : inject(Router).createUrlTree(['/', detectLang()]);

const routes: Routes = [
  { path: '', pathMatch: 'full', canActivate: [redirectToDetectedLang] },
  {
    path: ':lang',
    canActivate: [validLangGuard],
    children: [
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'custom-websites', component: CustomWebsitesComponent },
      { path: 'solicitar-web', component: CustomWebsitesComponent },
      { path: 'request-website', component: CustomWebsitesComponent }
    ]
  },
  { path: '**', canActivate: [redirectToDetectedLang] }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      scrollPositionRestoration: 'top'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
