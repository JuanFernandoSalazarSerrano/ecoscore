import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paladinappointments } from './paladinappointments';

describe('Paladinappointments', () => {
  let component: Paladinappointments;
  let fixture: ComponentFixture<Paladinappointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paladinappointments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Paladinappointments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
