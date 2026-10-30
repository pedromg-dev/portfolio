import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html',
  styleUrl: './theme-switch.component.css'
})
export class ThemeSwitchComponent {
  isAnimating: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  get isDark(): boolean {
    return this.document.documentElement.classList.contains('dark');
  }

  get inputChecked(): boolean {
    return this.isDark;
  }

  switchTheme(): void {
    this.isAnimating = true;
    setTimeout(() => {
      this.isAnimating = false;
    }, 550);

    const root = this.document.documentElement;
    const body = this.document.body;
    const nextIsDark = !this.isDark;

    const applyTheme = () => {
      if (nextIsDark) {
        root.classList.remove('light');
        root.classList.add('dark');
        body.classList.remove('light');
        body.classList.add('dark');
        localStorage['theme'] = 'dark';
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        body.classList.remove('dark');
        body.classList.add('light');
        localStorage['theme'] = 'light';
      }
    };

    const docWithTransition = this.document as Document & {
      startViewTransition?: (callback: () => void) => void;
    };

    if (docWithTransition.startViewTransition) {
      docWithTransition.startViewTransition(() => applyTheme());
    } else {
      applyTheme();
    }
  }
}
