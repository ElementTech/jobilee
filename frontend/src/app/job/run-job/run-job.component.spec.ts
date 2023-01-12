import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunJobComponent } from './run-job.component';

describe('RunJobComponent', () => {
  let component: RunJobComponent;
  let fixture: ComponentFixture<RunJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
