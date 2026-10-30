import { Component } from '@angular/core';
import { ViewportScroller } from "@angular/common";

@Component({
  selector: 'app-index-sidebar',
  templateUrl: './index-sidebar.component.html',
  styleUrl: './index-sidebar.component.css'
})
export class IndexSidebarComponent {
  constructor(private scroller: ViewportScroller) {}

  navigateTo(index: string): void {
    const element = window.document.getElementById(index);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  }

  scrollToIndex(index: string): void {
    this.scroller.scrollToAnchor(index);
  }
}
