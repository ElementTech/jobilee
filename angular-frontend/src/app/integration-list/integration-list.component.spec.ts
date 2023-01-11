import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationListComponent } from './integration-list.component';

describe('IntegrationListComponent', () => {
  let component: IntegrationListComponent;
  let fixture: ComponentFixture<IntegrationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegrationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
