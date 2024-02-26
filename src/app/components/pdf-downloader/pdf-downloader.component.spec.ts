import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfDownloaderComponent } from './pdf-downloader.component';

describe('PdfDownloaderComponent', () => {
  let component: PdfDownloaderComponent;
  let fixture: ComponentFixture<PdfDownloaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PdfDownloaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdfDownloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
