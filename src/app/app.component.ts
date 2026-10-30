import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
    AOS.init();
    window.addEventListener('load', () => AOS.refresh());
    flowbite.initFlowbite();
  }
}
