import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkinSelectionPageComponent } from './skin-selection-page.component';

describe('SkinSelectionPageComponent', () => {
  let component: SkinSelectionPageComponent;
  let fixture: ComponentFixture<SkinSelectionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkinSelectionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkinSelectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
