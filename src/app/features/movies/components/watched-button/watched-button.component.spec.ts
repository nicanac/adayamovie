import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WatchedButtonComponent } from './watched-button.component';

describe('WatchedButtonComponent', () => {
  let component: WatchedButtonComponent;
  let fixture: ComponentFixture<WatchedButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchedButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WatchedButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
