import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplosionComponent } from './explosion.component';

describe('ExplosionComponent', () => {
  let component: ExplosionComponent;
  let fixture: ComponentFixture<ExplosionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExplosionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplosionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
