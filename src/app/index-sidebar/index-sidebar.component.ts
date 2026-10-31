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
    const isSpecialView = this.router.url.includes('custom-websites') ||
                          this.router.url.includes('solicitar-web') ||
                          this.router.url.includes('request-website');

    if (isSpecialView) {
      this.router.navigate(['/', this.i18n.currentLang]).then(() => {
        this.scrollToTarget(index);
      });
      return;
    }

    this.scrollToTarget(index);
  }

  private scrollToTarget(index: string, attempts = 0): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (index === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = this.document.getElementById(index);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    } else if (attempts < 8) {
      setTimeout(() => this.scrollToTarget(index, attempts + 1), 60);
    }
  }
}
