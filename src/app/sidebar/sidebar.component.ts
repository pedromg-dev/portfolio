import { ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { I18nService } from '../i18n.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isEnglish: boolean = false;
  isOpen: boolean = false;
  isScrolled: boolean = false;
  private cleanupScroll?: () => void;

  constructor(
    public translate: TranslateService,
    private i18n: I18nService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isScrolled = window.scrollY > 24;

    this.ngZone.runOutsideAngular(() => {
      let ticking = false;
      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const nextScrolled = window.scrollY > 24;
            if (this.isScrolled !== nextScrolled) {
              this.isScrolled = nextScrolled;
              this.cdr.detectChanges();
            }
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      this.cleanupScroll = () => window.removeEventListener('scroll', onScroll);
    });
  }

  ngOnDestroy(): void {
    this.cleanupScroll?.();
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  goToCustomWebsites(): void {
    this.isOpen = false;
    this.router.navigate(['/', this.i18n.currentLang, 'custom-websites']).then(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  navigateTo(index: string): void {
    this.isOpen = false;

    const isOnCustomWeb = this.router.url.includes('custom-websites') ||
                          this.router.url.includes('solicitar-web') ||
                          this.router.url.includes('request-website');

    if (isOnCustomWeb) {
      this.router.navigate(['/', this.i18n.currentLang]).then(() => {
        if (!isPlatformBrowser(this.platformId)) {
          return;
        }
        if (index === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          setTimeout(() => {
            const element = this.document.getElementById(index);
            if (element) {
              const top = element.getBoundingClientRect().top + window.scrollY - 72;
              window.scrollTo({ top, behavior: 'smooth' });
            }
          }, 150);
        }
      });
      return;
    }

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (index === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = this.document.getElementById(index);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  }
}
