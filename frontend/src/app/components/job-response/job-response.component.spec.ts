import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobResponseComponent } from './job-Response.component';

describe('JobResponseComponent', () => {
  let component: JobResponseComponent;
  let fixture: ComponentFixture<JobResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
