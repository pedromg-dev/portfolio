import { ChangeDetectorRef, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isEnglish: boolean = false;
  isOpen: boolean = false;
  isScrolled: boolean = false;
  private cleanupScroll?: () => void;

  constructor(
    public translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isScrolled = window.scrollY > 24;

    // Run scroll listener outside NgZone with passive: true and requestAnimationFrame
    // to avoid triggering Angular change detection ticks on every scrolled pixel.
    this.ngZone.runOutsideAngular(() => {
      let ticking = false;
      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const nextScrolled = window.scrollY > 24;
            if (this.isScrolled !== nextScrolled) {
              this.isScrolled = nextScrolled;
              this.cdr.detectChanges();
            }
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      this.cleanupScroll = () => window.removeEventListener('scroll', onScroll);
    });
  }

  ngOnDestroy(): void {
    this.cleanupScroll?.();
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  navigateTo(index: string): void {
    if (index === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.isOpen = false;
      return;
    }

    const element = this.document.getElementById(index);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }

    this.isOpen = false;
  }
}
