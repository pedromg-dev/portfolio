import { Component, Inject } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { Router } from "@angular/router";
@Component({
  selector: 'app-drawer-menu',
  templateUrl: './drawer-menu.component.html',
  styleUrl: './drawer-menu.component.css'
})
export class DrawerMenuComponent {
  constructor(
    private scroller: ViewportScroller, 
    private router: Router) {
    }

  navigateTo(index: string) {
    window.document.getElementById(index)!.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  scrollToIndex(index: string) {
    this.scroller.scrollToAnchor(index);
  }
}
