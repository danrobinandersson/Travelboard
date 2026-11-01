import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaysWidget } from './holidays-widget';

describe('HolidaysWidget', () => {
  let component: HolidaysWidget;
  let fixture: ComponentFixture<HolidaysWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolidaysWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(HolidaysWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
