import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonHistoryTableComponent } from './pokemon-history-table.component';

describe('PokemonHistoryTableComponent', () => {
  let component: PokemonHistoryTableComponent;
  let fixture: ComponentFixture<PokemonHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonHistoryTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
