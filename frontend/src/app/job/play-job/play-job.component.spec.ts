import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayJobComponent } from './play-job.component';

describe('PlayJobComponent', () => {
  let component: PlayJobComponent;
  let fixture: ComponentFixture<PlayJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
