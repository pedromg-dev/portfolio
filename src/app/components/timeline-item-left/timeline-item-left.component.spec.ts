import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineItemLeftComponent } from './timeline-item-left.component';

describe('TimelineItemLeftComponent', () => {
  let component: TimelineItemLeftComponent;
  let fixture: ComponentFixture<TimelineItemLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimelineItemLeftComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimelineItemLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
