import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundsInfoComponent } from './compounds-info.component';

describe('CompoundsInfoComponent', () => {
  let component: CompoundsInfoComponent;
  let fixture: ComponentFixture<CompoundsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompoundsInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoundsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
