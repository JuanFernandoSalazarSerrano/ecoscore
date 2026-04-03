import { TestBed } from '@angular/core/testing';

import { TemperatureFetching } from './temperature-fetching';

describe('TemperatureFetching', () => {
  let service: TemperatureFetching;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemperatureFetching);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
