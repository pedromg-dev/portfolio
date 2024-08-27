import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timeline-item-left',
  templateUrl: './timeline-item-left.component.html',
  styleUrl: './timeline-item-left.component.css'
})
export class TimelineItemLeftComponent {
  @Input() title: string | undefined;
  @Input() dates: string | undefined;
  @Input() description: string | undefined;
  @Input() localization: string | undefined;
}

