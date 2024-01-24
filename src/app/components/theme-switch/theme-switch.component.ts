import { Component } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  styleUrl: './theme-switch.component.css'
})
export class ThemeSwitchComponent {

  constructor(@Inject(DOCUMENT) private document: Document) {

  }


  switchTheme() {
    if (this.document.body.classList.contains('dark')) {
      this.document.body.classList.remove('dark');
      this.document.body.classList.add('light');
    } else {
      this.document.body.classList.remove('light');
      this.document.body.classList.add('dark');
    }
  }
}
