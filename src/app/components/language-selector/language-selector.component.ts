import { Component } from '@angular/core';
import { I18nService } from '../../i18n.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css'
})
export class LanguageSelectorComponent {
  constructor(private i18n: I18nService) {}

  get isEnglish(): boolean {
    return this.i18n.currentLang === 'en';
  }

  changeLanguage(): void {
    this.i18n.switchTo(this.isEnglish ? 'es' : 'en');
  }
}
