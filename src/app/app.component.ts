import { Component } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'portfolio';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  changeLanguage(language: string): void {
    this.translate.use(language);
  }
}
