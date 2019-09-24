import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskViewComponentComponent } from './task-view-component.component';

describe('TaskViewComponentComponent', () => {
  let component: TaskViewComponentComponent;
  let fixture: ComponentFixture<TaskViewComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskViewComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskViewComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
