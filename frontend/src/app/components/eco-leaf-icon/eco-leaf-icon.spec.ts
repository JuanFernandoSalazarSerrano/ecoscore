import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoLeafIcon } from './eco-leaf-icon';

describe('EcoLeafIcon', () => {
  let component: EcoLeafIcon;
  let fixture: ComponentFixture<EcoLeafIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoLeafIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcoLeafIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
