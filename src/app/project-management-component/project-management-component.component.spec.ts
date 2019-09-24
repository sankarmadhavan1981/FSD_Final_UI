import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagementComponentComponent } from './project-management-component.component';

describe('ProjectManagementComponentComponent', () => {
  let component: ProjectManagementComponentComponent;
  let fixture: ComponentFixture<ProjectManagementComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectManagementComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectManagementComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
