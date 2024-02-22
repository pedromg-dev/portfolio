import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechLogoComponent } from './tech-logo.component';

describe('TechLogoComponent', () => {
  let component: TechLogoComponent;
  let fixture: ComponentFixture<TechLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechLogoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
