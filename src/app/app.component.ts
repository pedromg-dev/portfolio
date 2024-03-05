import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import * as AOS from 'aos';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'portfolio';

  constructor(public translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');

    if (translate.getBrowserLang() !== 'es') {
      translate.use('en');
    }
    else {
      translate.use('es');
    }

    if (localStorage['theme'] === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.remove('light')
      document.documentElement.classList.add('dark')
      document.body.classList.remove('light')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
      document.body.classList.remove('dark')
      document.body.classList.add('light')
    }

  }

  ngOnInit() {
    AOS.init();
    window.addEventListener('load', AOS.refresh);
    initFlowbite();
  }

  darkModeEnabled(): boolean {
    return this.document.documentElement.classList.contains('dark');
  }
}
