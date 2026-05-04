import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reportcomplete } from './reportcomplete';

describe('Reportcomplete', () => {
  let component: Reportcomplete;
  let fixture: ComponentFixture<Reportcomplete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reportcomplete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reportcomplete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
