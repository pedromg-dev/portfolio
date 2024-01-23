import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import { DOCUMENT } from '@angular/common'; 
import { Inject }  from '@angular/core'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'portfolio';

  constructor(public translate: TranslateService, @Inject(DOCUMENT) private document: Document) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');
    translate.use('es');
}

  changeLanguage(language: string): void {
    this.translate.use(language);
  }

  switchTheme() {
    if (this.document.body.classList.contains('dark')) {
      this.document.body.classList.remove('dark');
      this.document.body.classList.add('light');
    } else {
      this.document.body.classList.remove('light');
      this.document.body.classList.add('dark');
    }
  }
}
