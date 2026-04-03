import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoPaladinResults } from './eco-paladin-results';

describe('EcoPaladinResults', () => {
  let component: EcoPaladinResults;
  let fixture: ComponentFixture<EcoPaladinResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoPaladinResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcoPaladinResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
