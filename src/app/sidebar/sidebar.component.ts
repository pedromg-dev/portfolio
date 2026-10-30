import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isEnglish: boolean = false;
  isOpen: boolean = false;
  isScrolled: boolean = false;

  constructor(
    public translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit(): void {
    this.updateScrollState();
  }

  @HostListener('window:scroll')
  updateScrollState(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.isScrolled = window.scrollY > 24;
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  navigateTo(index: string): void {
    if (index === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.isOpen = false;
      return;
    }

    const element = this.document.getElementById(index);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }

    this.isOpen = false;
  }
}
