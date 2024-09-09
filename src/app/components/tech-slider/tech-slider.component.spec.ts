import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechSliderComponent } from './tech-slider.component';

describe('TechSliderComponent', () => {
  let component: TechSliderComponent;
  let fixture: ComponentFixture<TechSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechSliderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TechSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
