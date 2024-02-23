import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-index-sidebar-item',
  templateUrl: './index-sidebar-item.component.html',
  styleUrl: './index-sidebar-item.component.css'
})
export class IndexSidebarItemComponent {
  @Input() text: string | undefined;
}
