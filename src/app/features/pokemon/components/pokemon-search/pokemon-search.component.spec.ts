import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonSearchComponent } from './pokemon-search.component';
import { PokemonService } from '../../services/pokemon.service';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('PokemonSearchComponent', () => {
  let component: PokemonSearchComponent;
  let fixture: ComponentFixture<PokemonSearchComponent>;
  let pokemonService: jasmine.SpyObj<PokemonService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PokemonService', ['filterPokemon']);
    spy.filterPokemon.and.returnValue(['bulbasaur', 'bulbachu']);

    await TestBed.configureTestingModule({
      imports: [PokemonSearchComponent, FormsModule],
      providers: [
        { provide: PokemonService, useValue: spy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonSearchComponent);
    component = fixture.componentInstance;
    pokemonService = TestBed.inject(
      PokemonService
    ) as jasmine.SpyObj<PokemonService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show suggestions when search term is less than 2 characters', () => {
    component.searchTerm = 'a';
    component.onSearchChange('a');
    fixture.detectChanges();

    const suggestionsContainer = fixture.debugElement.query(
      By.css('.absolute')
    );
    expect(suggestionsContainer).toBeFalsy();
  });

  it('should show suggestions when search term is 2 or more characters', () => {
    component.searchTerm = 'bu';
    component.onSearchChange('bu');
    fixture.detectChanges();

    const suggestions = fixture.debugElement.queryAll(
      By.css('.absolute button')
    );
    expect(suggestions.length).toBe(2);
    expect(suggestions[0].nativeElement.textContent.trim()).toBe('Bulbasaur');
  });

  it('should emit search term when clicking search button', () => {
    spyOn(component.searchSubmitted, 'emit');
    component.searchTerm = 'pikachu';
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button'));
    button.nativeElement.click();

    expect(component.searchSubmitted.emit).toHaveBeenCalledWith('pikachu');
  });

  it('should clear suggestions after search', () => {
    component.suggestions = ['bulbasaur', 'bulbachu'];
    component.searchTerm = 'bulbasaur';
    component.search();

    expect(component.suggestions).toEqual([]);
  });

  it('should select suggestion and trigger search', () => {
    spyOn(component.searchSubmitted, 'emit');
    component.selectSuggestion('bulbasaur');

    expect(component.searchTerm).toBe('bulbasaur');
    expect(component.suggestions).toEqual([]);
    expect(component.searchSubmitted.emit).toHaveBeenCalledWith('bulbasaur');
  });

  it('should show loading spinner when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('.animate-spin'));
    expect(spinner).toBeTruthy();
  });
});
