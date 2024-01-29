import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-with-header',
  templateUrl: './section-with-header.component.html',
  styleUrl: './section-with-header.component.css'
})
export class SectionWithHeaderComponent {
   @Input() id: string | undefined;
  // @Input() bodySection: string | undefined;
}
