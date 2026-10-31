import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

export const SUPPORTED_LANGS = ['es', 'en'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const SITE_URL = 'https://www.pedromg.dev';

export function isLang(value: string | null | undefined): value is Lang {
  return value === 'es' || value === 'en';
}

export function detectLang(): Lang {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('lang');
    if (isLang(saved)) {
      return saved;
    }
  }
  const browserLang = typeof navigator !== 'undefined' ? navigator.language || 'en' : 'en';
  return browserLang.toLowerCase().startsWith('es') ? 'es' : 'en';
}

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  constructor(
    private router: Router,
    private translate: TranslateService,
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  init(): void {
    this.translate.addLangs([...SUPPORTED_LANGS]);
    this.translate.setDefaultLang('es');

    this.applyFromUrl();
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.applyFromUrl());
  }

  get currentLang(): Lang {
    const fromUrl = this.langFromUrl();
    if (fromUrl) {
      return fromUrl;
    }
    return isLang(this.translate.currentLang) ? this.translate.currentLang : detectLang();
  }

  switchTo(lang: Lang): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
    const currentUrl = this.router.url;
    const parts = currentUrl.split(/[?#]/)[0].split('/').filter(Boolean);
    if (parts.length > 0 && isLang(parts[0])) {
      parts[0] = lang;
      this.router.navigate(['/', ...parts]);
    } else {
      this.router.navigate(['/', lang]);
    }
  }

  private langFromUrl(): Lang | null {
    const segment = this.router.url.split(/[/?#]/)[1];
    return isLang(segment) ? segment : null;
  }

  private applyFromUrl(): void {
    const lang = this.langFromUrl();
    if (lang) {
      this.apply(lang);
    }
  }

  private apply(lang: Lang): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
    this.translate.use(lang).subscribe(() => {
      this.document.documentElement.lang = lang;

      const isCustomWeb = this.router.url.includes('custom-websites') ||
                          this.router.url.includes('solicitar-web') ||
                          this.router.url.includes('request-website');

      const title = this.translate.instant(isCustomWeb ? 'CustomWebSeoTitle' : 'SeoTitle');
      const description = this.translate.instant(isCustomWeb ? 'CustomWebSeoDescription' : 'SeoDescription');
      const url = isCustomWeb ? `${SITE_URL}/${lang}/custom-websites` : `${SITE_URL}/${lang}`;

      this.title.setTitle(title);
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:title', content: title });
      this.meta.updateTag({ property: 'og:description', content: description });
      this.meta.updateTag({ property: 'og:url', content: url });
      this.meta.updateTag({ property: 'og:locale', content: lang === 'es' ? 'es_ES' : 'en_US' });
      this.meta.updateTag({ property: 'og:locale:alternate', content: lang === 'es' ? 'en_US' : 'es_ES' });
      this.meta.updateTag({ name: 'twitter:title', content: title });
      this.meta.updateTag({ name: 'twitter:description', content: description });

      if (isCustomWeb) {
        this.setLink('canonical', url);
        this.setLink('alternate', `${SITE_URL}/es/custom-websites`, 'es');
        this.setLink('alternate', `${SITE_URL}/en/custom-websites`, 'en');
        this.setLink('alternate', `${SITE_URL}/es/custom-websites`, 'x-default');
      } else {
        this.setLink('canonical', url);
        this.setLink('alternate', `${SITE_URL}/es`, 'es');
        this.setLink('alternate', `${SITE_URL}/en`, 'en');
        this.setLink('alternate', SITE_URL + '/', 'x-default');
      }
    });
  }

  private setLink(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang
      ? `link[rel="${rel}"][hreflang="${hreflang}"]`
      : `link[rel="${rel}"]`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      if (hreflang) {
        link.setAttribute('hreflang', hreflang);
      }
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
