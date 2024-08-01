import { Component } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {
  isEnglish: boolean = false;
  isOpen: boolean = false;

  constructor(
    public translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  changeLanguage(language: string): void {
    this.translate.use(language);
    this.isEnglish = language == 'es' ? false : true;
  }

  openMenu() : void {
    this.isOpen = true;
  }

  navigateTo(index: string) {
    this.document.getElementById(index)!.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });

    this.isOpen = false;
  }
}