import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdfFileComponent } from './sdf-file.component';

describe('SdfFileComponent', () => {
  let component: SdfFileComponent;
  let fixture: ComponentFixture<SdfFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SdfFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SdfFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
