import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { I18nService } from '../i18n.service';

export type LegalTab = 'legal' | 'privacy' | 'cookies';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.css'
})
export class LegalComponent implements OnInit {
  activeTab: LegalTab = 'privacy';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private meta: Meta,
    public translate: TranslateService,
    public i18n: I18nService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    const url = this.router.url;
    if (url.includes('aviso-legal') || url.includes('legal-notice')) {
      this.activeTab = 'legal';
    } else if (url.includes('cookies')) {
      this.activeTab = 'cookies';
    } else {
      this.activeTab = 'privacy';
    }

    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    this.updateSeo();
  }

  setTab(tab: LegalTab): void {
    this.activeTab = tab;
    const isEs = this.i18n.currentLang === 'es';
    let path = '';
    if (tab === 'legal') path = isEs ? 'aviso-legal' : 'legal-notice';
    else if (tab === 'privacy') path = isEs ? 'privacidad' : 'privacy-policy';
    else if (tab === 'cookies') path = isEs ? 'cookies' : 'cookies-policy';

    this.router.navigate(['/', this.i18n.currentLang, path], { replaceUrl: true });
    this.updateSeo();
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goBackToHome(): void {
    this.router.navigate(['/', this.i18n.currentLang]).then(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  openCookieBanner(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.dispatchEvent(new Event('openCookieBanner'));
    }
  }

  private updateSeo(): void {
    const isEs = this.i18n.currentLang === 'es';
    let tabTitle = '';
    if (this.activeTab === 'legal') {
      tabTitle = isEs ? 'Aviso Legal (LSSI-CE)' : 'Legal Notice';
    } else if (this.activeTab === 'privacy') {
      tabTitle = isEs ? 'Política de Privacidad (RGPD)' : 'Privacy Policy';
    } else {
      tabTitle = isEs ? 'Política de Cookies' : 'Cookies Policy';
    }

    this.title.setTitle(`${tabTitle} | Pedro Moya — pedromg.dev`);
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
  }
}
