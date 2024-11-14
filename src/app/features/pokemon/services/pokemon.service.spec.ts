import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { PokemonService } from './pokemon.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService]
    });
    service = TestBed.inject(PokemonService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const req = httpTestingController.expectOne('https://pokeapi.co/api/v2/pokemon/?limit=100000&offset=0');
    req.flush({ results: [] });

    expect(service).toBeTruthy();
  });

  it('should load pokemon list on initialization', () => {
    const mockResponse = {
      count: 2,
      results: [
        { name: 'bulbasaur', url: 'url1' },
        { name: 'ivysaur', url: 'url2' },
      ],
    };

    const req = httpTestingController.expectOne(
      'https://pokeapi.co/api/v2/pokemon/?limit=100000&offset=0'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    const result = service.filterPokemon('bul');
    expect(result).toEqual(['bulbasaur']);
  });

  it('should handle getPokemon success', () => {
    const mockPokemon = {
      name: 'bulbasaur',
      types: [{ slot: 1, type: { name: 'grass', url: 'type-url' } }],
      base_stats: [],
      abilities: [],
      weight: 69,
      height: 7,
      id: 1,
      sprites: {
        front_default: 'url',
        back_default: 'back-url', // Add this line
      },
      moves: [],
    };

    service.getPokemon('bulbasaur').subscribe((pokemon) => {
      expect(pokemon).toEqual(mockPokemon);
    });

    const req = httpTestingController.expectOne(
      'https://pokeapi.co/api/v2/pokemon/bulbasaur'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPokemon);
  });

  it('should handle getPokemon 404 error', () => {
    service.getPokemon('nonexistent').subscribe({
      error: (error) => {
        expect(error.message).toBe('Pokemon not found');
      },
    });

    const req = httpTestingController.expectOne(
      'https://pokeapi.co/api/v2/pokemon/nonexistent'
    );
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
