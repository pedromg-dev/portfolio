import { Component, Inject } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: 'app-index-sidebar',
  templateUrl: './index-sidebar.component.html',
  styleUrl: './index-sidebar.component.css'
})
export class IndexSidebarComponent {
  constructor(
    private scroller: ViewportScroller, 
    private router: Router) {
    }

  navigateTo(index: string) {
    const documento = window.document.getElementById(index)!.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

  scrollToIndex(index: string) {
    this.scroller.scrollToAnchor(index);
  }

  goDown(index: string) {
    this.router.navigate([], { fragment: index });
  }
}
