import { Component } from '@angular/core';

@Component({
  selector: 'app-main-information',
  templateUrl: './main-information.component.html',
  styleUrl: './main-information.component.css'
})
export class MainInformationComponent {
  scrollToAbout(): void {
    const element = window.document.getElementById('about-me');
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  }
}
