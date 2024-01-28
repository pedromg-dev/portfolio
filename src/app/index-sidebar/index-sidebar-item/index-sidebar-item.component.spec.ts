import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexSidebarItemComponent } from './index-sidebar-item.component';

describe('IndexSidebarItemComponent', () => {
  let component: IndexSidebarItemComponent;
  let fixture: ComponentFixture<IndexSidebarItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndexSidebarItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IndexSidebarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
