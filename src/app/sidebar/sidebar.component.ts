import { Component } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  public themeStatus : boolean = false;

  constructor(public translate: TranslateService, @Inject(DOCUMENT) private document: Document) {

  }


  changeLanguage(language: string): void {
    this.translate.use(language);
  }
  

  switchTheme() {
    this.themeStatus == !this.themeStatus;

    if (this.document.body.classList.contains('dark')) {
      this.document.body.classList.remove('dark');
      this.document.body.classList.add('light');
    } else {
      this.document.body.classList.remove('light');
      this.document.body.classList.add('dark');
    }
  }
}
