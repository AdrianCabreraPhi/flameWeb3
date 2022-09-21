import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnepredictionComponent } from './oneprediction.component';

describe('OnepredictionComponent', () => {
  let component: OnepredictionComponent;
  let fixture: ComponentFixture<OnepredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnepredictionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnepredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
