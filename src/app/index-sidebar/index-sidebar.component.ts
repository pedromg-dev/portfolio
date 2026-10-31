import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-index-sidebar',
  templateUrl: './index-sidebar.component.html',
  styleUrl: './index-sidebar.component.css'
})
export class IndexSidebarComponent {
  constructor(
    private router: Router,
    private i18n: I18nService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  navigateTo(index: string): void {
    const isOnCustomWeb = this.router.url.includes('custom-websites') ||
                          this.router.url.includes('solicitar-web') ||
                          this.router.url.includes('request-website');

    if (isOnCustomWeb) {
      this.router.navigate(['/', this.i18n.currentLang]).then(() => {
        if (!isPlatformBrowser(this.platformId)) {
          return;
        }
        setTimeout(() => {
          const element = this.document.getElementById(index);
          if (element) {
            const top = element.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }, 150);
      });
      return;
    }

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const element = this.document.getElementById(index);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  }
}
