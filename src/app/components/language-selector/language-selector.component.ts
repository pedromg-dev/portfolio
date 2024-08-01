import { Component } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css'
})
export class LanguageSelectorComponent {

    isEnglish: boolean = false;
  
    constructor(public translate: TranslateService, @Inject(DOCUMENT) private document: Document) {
      this.isEnglish = this.translate.currentLang == "es" ? false : true;
    }
  
    changeLanguage(): void {
      this.translate.use(this.translate.currentLang == "es" ? 'en' : 'es');
      this.isEnglish = !this.isEnglish;
    }
  }
