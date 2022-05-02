import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplePredictionComponent } from './multiple-prediction.component';

describe('MultiplePredictionComponent', () => {
  let component: MultiplePredictionComponent;
  let fixture: ComponentFixture<MultiplePredictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiplePredictionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplePredictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
