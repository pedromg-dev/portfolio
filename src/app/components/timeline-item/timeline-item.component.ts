import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-timeline-item',
  templateUrl: './timeline-item.component.html',
  styleUrl: './timeline-item.component.css'
})
export class TimelineItemComponent {
  @Input() title: string | undefined;
  @Input() company: string | undefined;
  @Input() subtitle: string | undefined;
  @Input() dates: string | undefined;
  @Input() description: string | undefined;
  @Input() localization: string | undefined;
  @Input() isCurrent: boolean = false;
  @Input() isLast: boolean = false;
}
