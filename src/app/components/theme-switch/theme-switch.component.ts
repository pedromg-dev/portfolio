import { Component } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  styleUrl: './theme-switch.component.css'
})
export class ThemeSwitchComponent {
  inputChecked : boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document) {
    if (this.document.documentElement.classList.contains('dark')) {
      this.inputChecked = true;
    }
  }


  switchTheme() {
    localStorage.removeItem('theme');

    if (this.document.documentElement.classList.contains('dark')) {
      this.document.documentElement.classList.remove('dark');
      this.document.documentElement.classList.add('light');
      document.body.classList.remove('dark')
      document.body.classList.add('light')
      localStorage['theme'] = 'light';
    } else {
      this.document.documentElement.classList.remove('light');
      this.document.documentElement.classList.add('dark');
      document.body.classList.remove('light')
      document.body.classList.add('dark')
      localStorage['theme'] = 'dark';
    }
  }
}
