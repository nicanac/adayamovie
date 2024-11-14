import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamingSelectorComponent } from './streaming-selector.component';

describe('StreamingSelectorComponent', () => {
  let component: StreamingSelectorComponent;
  let fixture: ComponentFixture<StreamingSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamingSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamingSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
