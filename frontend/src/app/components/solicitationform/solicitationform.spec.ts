import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Solicitationform } from './solicitationform';

describe('Solicitationform', () => {
  let component: Solicitationform;
  let fixture: ComponentFixture<Solicitationform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Solicitationform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Solicitationform);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
