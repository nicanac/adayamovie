import { TestBed } from '@angular/core/testing';

import { WatchedMovieService } from './watched-movie.service';

describe('WatchedMovieService', () => {
  let service: WatchedMovieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchedMovieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
