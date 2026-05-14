import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Waitingforreport } from './waitingforreport';

describe('Waitingforreport', () => {
  let component: Waitingforreport;
  let fixture: ComponentFixture<Waitingforreport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Waitingforreport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Waitingforreport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
