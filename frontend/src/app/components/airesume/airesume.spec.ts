import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Airesume } from './airesume';

describe('Airesume', () => {
  let component: Airesume;
  let fixture: ComponentFixture<Airesume>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Airesume]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Airesume);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
