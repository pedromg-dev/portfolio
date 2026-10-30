import { Component } from '@angular/core';
import { ViewportScroller } from "@angular/common";

@Component({
  selector: 'app-drawer-menu',
  templateUrl: './drawer-menu.component.html',
  styleUrl: './drawer-menu.component.css'
})
export class DrawerMenuComponent {
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
