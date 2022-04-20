import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelSelectedInfoComponent } from './model-selected-info.component';

describe('ModelSelectedInfoComponent', () => {
  let component: ModelSelectedInfoComponent;
  let fixture: ComponentFixture<ModelSelectedInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelSelectedInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelSelectedInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
