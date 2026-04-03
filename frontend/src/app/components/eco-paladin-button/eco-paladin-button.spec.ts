import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoPaladinButton } from './eco-paladin-button';

describe('EcoPaladinButton', () => {
  let component: EcoPaladinButton;
  let fixture: ComponentFixture<EcoPaladinButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoPaladinButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcoPaladinButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
