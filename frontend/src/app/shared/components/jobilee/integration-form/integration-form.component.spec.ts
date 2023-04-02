import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationFormComponent } from './integration-form.component';

describe('IntegrationFormComponent', () => {
  let component: IntegrationFormComponent;
  let fixture: ComponentFixture<IntegrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegrationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
