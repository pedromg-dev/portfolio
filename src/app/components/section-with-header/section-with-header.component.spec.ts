import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionWithHeaderComponent } from './section-with-header.component';

describe('SectionWithHeaderComponent', () => {
  let component: SectionWithHeaderComponent;
  let fixture: ComponentFixture<SectionWithHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionWithHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SectionWithHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
