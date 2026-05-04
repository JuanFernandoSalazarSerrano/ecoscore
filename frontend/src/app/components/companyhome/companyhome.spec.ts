import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Companyhome } from './companyhome';

describe('Companyhome', () => {
  let component: Companyhome;
  let fixture: ComponentFixture<Companyhome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Companyhome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Companyhome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
