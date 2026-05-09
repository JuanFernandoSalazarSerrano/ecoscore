import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paladinbuildreport } from './paladinbuildreport';

describe('Paladinbuildreport', () => {
  let component: Paladinbuildreport;
  let fixture: ComponentFixture<Paladinbuildreport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paladinbuildreport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Paladinbuildreport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
