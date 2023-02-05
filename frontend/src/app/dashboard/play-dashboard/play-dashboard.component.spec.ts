import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayDashboardComponent } from './play-dashboard.component';

describe('PlayDashboardComponent', () => {
  let component: PlayDashboardComponent;
  let fixture: ComponentFixture<PlayDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
