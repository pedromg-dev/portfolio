import { Component, Inject, OnInit, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private ngZone: NgZone
  ) {}

  async ngOnInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const aosModule = await import('aos');
    const AOS = (aosModule as any).default ?? aosModule;

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        AOS.refreshHard();
      }, 50);
    });
  }
}
