import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrl: './cookie-banner.component.css'
})
export class CookieBannerComponent implements OnInit {
  showBanner: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const consent = localStorage.getItem('cookie_consent');
      if (!consent) {
        // Small delay so it animates in smoothly after initial page render
        setTimeout(() => {
          this.showBanner = true;
        }, 800);
      }

      // Listen for custom event to reopen preferences from the footer
      window.addEventListener('openCookieBanner', () => {
        this.showBanner = true;
      });
    }
  }

  acceptAll(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cookie_consent', 'accepted');
    }
    this.showBanner = false;
  }

  acceptTechnicalOnly(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cookie_consent', 'technical');
    }
    this.showBanner = false;
  }

  goToCookiesPolicy(): void {
    const route = this.i18n.currentLang === 'es' ? 'cookies' : 'cookies-policy';
    this.router.navigate(['/', this.i18n.currentLang, route]);
  }
}
