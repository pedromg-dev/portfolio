import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { I18nService } from './i18n.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'portfolio';
  private isBrowser: boolean;

  constructor(
    private i18n: I18nService,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.i18n.init();

    if (this.isBrowser) {
      const prefersDark = localStorage['theme'] === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
      const root = this.document.documentElement;
      const body = this.document.body;
      root.classList.remove(prefersDark ? 'light' : 'dark');
      root.classList.add(prefersDark ? 'dark' : 'light');
      body.classList.remove(prefersDark ? 'light' : 'dark');
      body.classList.add(prefersDark ? 'dark' : 'light');
    }
  }

  async ngOnInit(): Promise<void> {
    if (!this.isBrowser) {
      return;
    }
    const [aosModule, flowbite] = await Promise.all([import('aos'), import('flowbite')]);
    const AOS = (aosModule as any).default ?? aosModule;

    // Run AOS and Flowbite listeners outside NgZone so they don't capture scroll gestures
    // or trigger Angular Change Detection ticks on every scroll frame.
    this.ngZone.runOutsideAngular(() => {
      AOS.init({
        once: true,
        duration: 400,
        easing: 'ease-out-cubic',
        throttleDelay: 99,
        offset: 60,
        disableMutationObserver: true
      });
      AOS.refresh();
      flowbite.initFlowbite();
    });
  }
}
