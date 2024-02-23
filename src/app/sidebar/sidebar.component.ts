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
  isEnglish: boolean = false;

  constructor(public translate: TranslateService, @Inject(DOCUMENT) private document: Document) {

  }

  changeLanguage(language: string): void {
    this.translate.use(language);
    this.isEnglish = !this.isEnglish;
  }
}

