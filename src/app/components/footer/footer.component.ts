import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
    public i18n: I18nService
  ) {}

  goToLegal(page: 'legal' | 'privacy' | 'cookies'): void {
    const isEs = this.i18n.currentLang === 'es';
    let path = '';
    if (page === 'legal') path = isEs ? 'aviso-legal' : 'legal-notice';
    else if (page === 'privacy') path = isEs ? 'privacidad' : 'privacy-policy';
    else if (page === 'cookies') path = isEs ? 'cookies' : 'cookies-policy';

    this.router.navigate(['/', this.i18n.currentLang, path]).then(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  openCookiePreferences(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.dispatchEvent(new Event('openCookieBanner'));
    }
  }
}
