import { TestBed } from '@angular/core/testing';

import { ObstacleService } from './obstacle.service';

describe('ObstacleService', () => {
  let service: ObstacleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObstacleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
