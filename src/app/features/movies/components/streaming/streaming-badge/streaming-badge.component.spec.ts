import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamingBadgeComponent } from './streaming-badge.component';

describe('StreamingBadgeComponent', () => {
  let component: StreamingBadgeComponent;
  let fixture: ComponentFixture<StreamingBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamingBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StreamingBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
