import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieSearchResultsComponent } from './movie-search-results.component';

describe('MovieSearchResultsComponent', () => {
  let component: MovieSearchResultsComponent;
  let fixture: ComponentFixture<MovieSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieSearchResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
