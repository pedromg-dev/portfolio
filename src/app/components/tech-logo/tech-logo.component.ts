import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tech-logo',
  templateUrl: './tech-logo.component.html',
  styleUrl: './tech-logo.component.css'
})
export class TechLogoComponent {
  @Input() url: string | undefined;
  @Input() name: string | undefined;
}
