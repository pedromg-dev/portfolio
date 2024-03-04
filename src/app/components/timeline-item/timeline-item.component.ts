import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline-item',
  templateUrl: './timeline-item.component.html',
  styleUrl: './timeline-item.component.css'
})
export class TimelineItemComponent {
  @Input() title: string | undefined;
  @Input() dates: string | undefined;
  @Input() description: string | undefined;
  @Input() localization: string | undefined;
}
