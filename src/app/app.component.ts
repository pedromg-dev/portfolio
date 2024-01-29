import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'portfolio';

  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');
    translate.use('es');
  }

  ngOnInit() {
    AOS.init();
    window.addEventListener('load', AOS.refresh)
  }
}
